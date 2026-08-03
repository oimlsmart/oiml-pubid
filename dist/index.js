"use strict";
// ─────────────────────────────────────────────────────────────────────
// @oimlsmart/oiml-pubid — the OIML publication identifier system:
// the parser and the URN convention, THE single source of truth.
// Every OIML SMART consumer imports from here; nothing reimplements.
//
// The grammar (from the OIML corpus):
//   pubid      := "OIML" ["-CS"] family number ["-" part] [":" year]
//                 ["(" lang ")"] ["Edition" n] ["(Amendment" n ")"]
//   family     := "R" | "B" | "D" | "G" | "E" | "V"      (publications)
//   family     := "PD" | "OD" | "CID"                     (the CS family)
//   number     := digits · part := digits · year := 4 digits
//   lang       := "(" letter+ ")"          e.g. (E), (F), (E/F)
//   "Edition"  := n                       e.g. Edition 6
//   amendment  := "(Amendment" n ")"
// ─────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOimlPubid = parseOimlPubid;
exports.urnForOimlPubid = urnForOimlPubid;
exports.urnForIdentifier = urnForIdentifier;
function tokenize(src) {
    const out = [];
    let i = 0;
    const s = src.trim();
    while (i < s.length) {
        const c = s[i];
        if (/\s/.test(c)) {
            i++;
            continue;
        }
        if (/[A-Za-z]/.test(c)) {
            let j = i;
            while (j < s.length && /[A-Za-z/]/.test(s[j]))
                j++;
            out.push({ kind: 'word', value: s.slice(i, j) });
            i = j;
        }
        else if (/[0-9]/.test(c)) {
            let j = i;
            while (j < s.length && /[0-9]/.test(s[j]))
                j++;
            out.push({ kind: 'num', value: s.slice(i, j) });
            i = j;
        }
        else {
            out.push({ kind: 'punct', value: c });
            i++;
        }
    }
    return out;
}
const PUB_FAMILIES = new Set(['r', 'b', 'd', 'g', 'e', 'v']);
const CS_FAMILIES = new Set(['pd', 'od', 'cid']);
/** Parse an OIML publication identifier. Returns null when the shape
 *  is not an OIML pubid (the caller decides the fallback). */
function parseOimlPubid(src, bibdataYear = '') {
    const t = tokenize(src);
    let i = 0;
    const peek = () => t[i];
    const eat = () => t[i++];
    // "OIML" ["-" "CS"] (both `OIML-CS` and `OIML CS` parse)
    const head = eat();
    if (head?.kind !== 'word' || head.value.toUpperCase() !== 'OIML')
        return null;
    let series = 'pub';
    if (peek()?.kind === 'punct' && peek().value === '-' && t[i + 1]?.kind === 'word' && t[i + 1].value.toUpperCase() === 'CS') {
        eat();
        eat();
        series = 'cs';
    }
    else if (peek()?.kind === 'word' && peek().value.toUpperCase() === 'CS') {
        eat();
        series = 'cs';
    }
    // family
    const fam = eat();
    if (fam?.kind !== 'word')
        return null;
    const family = fam.value.toLowerCase();
    if (series === 'cs' ? !CS_FAMILIES.has(family) : !PUB_FAMILIES.has(family))
        return null;
    // "-" before the number is optional (R 60 / PD-05 / PD 05)
    if (peek()?.kind === 'punct' && peek().value === '-')
        eat();
    // number
    const num = eat();
    if (num?.kind !== 'num')
        return null;
    // ["-" part]
    let part;
    if (peek()?.kind === 'punct' && peek().value === '-' && t[i + 1]?.kind === 'num') {
        eat();
        part = eat().value;
    }
    // [":" year]
    let year;
    if (peek()?.kind === 'punct' && peek().value === ':' && t[i + 1]?.kind === 'num' && t[i + 1].value.length === 4) {
        eat();
        year = eat().value;
    }
    // ["(" lang ")"] — optional, discarded (the language marker)
    if (peek()?.kind === 'punct' && peek().value === '(') {
        let depth = 0;
        let j = i;
        while (j < t.length && !(t[j].kind === 'punct' && t[j].value === ')' && depth === 1)) {
            if (t[j].kind === 'punct' && t[j].value === '(')
                depth++;
            j++;
            if (depth === 1 && t[j]?.kind === 'punct' && t[j].value === ')')
                break;
        }
        if (j < t.length)
            i = j + 1; // consumed "( … )"
    }
    // ["Edition" n]
    let edition;
    if (peek()?.kind === 'word' && peek().value.toLowerCase() === 'edition' && t[i + 1]?.kind === 'num') {
        eat();
        edition = eat().value;
    }
    // ["(Amendment" n ")"]
    let amendment;
    if (peek()?.kind === 'punct' && peek().value === '('
        && t[i + 1]?.kind === 'word' && t[i + 1].value.toLowerCase() === 'amendment'
        && t[i + 2]?.kind === 'num') {
        eat();
        eat();
        amendment = eat().value;
        if (peek()?.kind === 'punct' && peek().value === ')')
            eat();
    }
    // Anything left unparsed means the shape was not an OIML pubid.
    if (i < t.length)
        return null;
    return {
        series,
        family,
        number: num.value,
        ...(part ? { part } : {}),
        ...(year ? { year } : bibdataYear ? { year: bibdataYear } : {}),
        ...(edition ? { edition } : {}),
        ...(amendment ? { amendment } : {}),
    };
}
/** The OIML URN convention, composed from the parsed structure:
 *  pub series → urn:oiml:pub:{family}:{number}[-{part}][:{year}]
 *  cs series  → urn:oiml:pub:cs:{family}-{number}[:{year}] */
function urnForOimlPubid(pubid) {
    const year = pubid.year ? `:${pubid.year}` : '';
    if (pubid.series === 'cs') {
        return `urn:oiml:pub:cs:${pubid.family}-${pubid.number}${year}`;
    }
    const part = pubid.part ? `-${pubid.part}` : '';
    return `urn:oiml:pub:${pubid.family}:${pubid.number}${part}${year}`;
}
/** The one-call convenience: identifier (+ optional bibdata year) →
 *  the URN, or null when the identifier is not an OIML pubid. */
function urnForIdentifier(src, bibdataYear = '') {
    const pubid = parseOimlPubid(src, bibdataYear);
    return pubid ? urnForOimlPubid(pubid) : null;
}
//# sourceMappingURL=index.js.map