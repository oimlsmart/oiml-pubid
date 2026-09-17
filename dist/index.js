"use strict";
// ─────────────────────────────────────────────────────────────────────
// @oimlsmart/oiml-pubid — the OIML publication identifier system:
// the parser and the URN convention, THE single source of truth.
// Every OIML SMART consumer imports from here; nothing reimplements.
//
// The grammar (from the OIML corpus):
//   pubid      := "OIML" ["-CS"] family number ["-" part] [":" year]
//                 ["(" lang ")"] ["Edition" n] ["(Amendment" n ")"]
//   family     := "R" | "B" | "D" | "G" | "E" | "V" | "S"  (publications; S = seminar report)
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
const PUB_FAMILIES = new Set(['r', 'b', 'd', 'g', 'e', 'v', 's']);
const CS_FAMILIES = new Set(['pd', 'od', 'cid']);
// OIML language markers as authored (single letters, ISO 639-2/3, and
// stray variants) → the canonical ISO 639-1 code used in URNs.
const LANG_CODE_MAP = {
    e: 'en', f: 'fr', a: 'ar',
    en: 'en', fr: 'fr', ar: 'ar',
    eng: 'en', fra: 'fr', ara: 'ar',
    sr: 'sr', srp: 'sr',
    uk: 'uk', ua: 'uk', ukr: 'uk',
    zh: 'zh', zho: 'zh', chi: 'zh', cn: 'zh',
    de: 'de', deu: 'de', ger: 'de',
    ru: 'ru', rus: 'ru',
    pl: 'pl', pol: 'pl',
    pt: 'pt', por: 'pt',
    es: 'es', spa: 'es', sp: 'es',
    fa: 'fa', fas: 'fa', fara: 'fa',
    ro: 'ro', ron: 'ro',
};
/** Normalize a parenthesized language marker — "(E)", "(E/F)",
 *  "(Fra)", "(en)" — to the URN form: mapped codes, sorted
 *  alphabetically, hyphen-separated ("en-fr"). Returns undefined when
 *  the marker is not a language marker (not letters-only segments). */
function languageFromMarker(raw) {
    const segments = raw.toLowerCase().split('/').map(s => s.trim()).filter(Boolean);
    if (segments.length === 0)
        return undefined;
    if (!segments.every(s => /^[a-z]+$/.test(s)))
        return undefined;
    const mapped = segments.map(s => LANG_CODE_MAP[s] ?? s);
    return [...new Set(mapped)].sort().join('-');
}
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
    let edition;
    let amendment;
    let language;
    if (peek()?.kind === 'punct' && peek().value === ':' && t[i + 1]?.kind === 'num' && t[i + 1].value.length === 4) {
        eat();
        year = eat().value;
    }
    // ["6th" "Edition" year] — the ordinal edition form ("OIML E 5 6th
    // Edition 2015"): the ordinal's year IS the publication year.
    if (peek()?.kind === 'num' && t[i + 1]?.kind === 'word' && /^(st|nd|rd|th)$/i.test(t[i + 1].value)
        && t[i + 2]?.kind === 'word' && t[i + 2].value.toLowerCase() === 'edition'
        && t[i + 3]?.kind === 'num' && t[i + 3].value.length === 4) {
        edition = eat().value;
        eat();
        eat();
        year = eat().value;
    }
    // The trailing tail — language parens, the edition word, the amendment
    // marker — appears in either order in the wild ("OIML R 106(E)" vs
    // "OIML D 2 Edition 1999 (E)"), so consume whatever matches until the
    // tail stops matching.
    for (;;) {
        // ["(Amendment" n ")"]
        if (peek()?.kind === 'punct' && peek().value === '('
            && t[i + 1]?.kind === 'word' && t[i + 1].value.toLowerCase() === 'amendment'
            && t[i + 2]?.kind === 'num') {
            eat();
            eat();
            amendment = eat().value;
            if (peek()?.kind === 'punct' && peek().value === ')')
                eat();
            continue;
        }
        // ["(" lang ")"] — the language marker, captured when it parses as one
        if (peek()?.kind === 'punct' && peek().value === '(') {
            let depth = 0;
            let j = i;
            const inner = [];
            while (j < t.length && !(t[j].kind === 'punct' && t[j].value === ')' && depth === 1)) {
                if (t[j].kind === 'punct' && t[j].value === '(') {
                    depth++;
                    j++;
                    continue;
                }
                inner.push(t[j].value);
                j++;
                if (depth === 1 && t[j]?.kind === 'punct' && t[j].value === ')')
                    break;
            }
            if (j < t.length) {
                const lang = languageFromMarker(inner.join(' '));
                if (lang)
                    language = lang;
                i = j + 1;
                continue; // consumed "( … )"
            }
        }
        // ["Amendment" [":" | n] [year]] — the trailing amendment marker,
        // no parens ("OIML R 138:2009 Amendment 1", "…Amendment:2009")
        if (peek()?.kind === 'word' && peek().value.toLowerCase() === 'amendment') {
            eat();
            if (peek()?.kind === 'punct' && peek().value === ':' && t[i + 1]?.kind === 'num') {
                eat();
                amendment = eat().value;
            }
            else if (peek()?.kind === 'num') {
                amendment = eat().value;
            }
            continue;
        }
        // ["Edition" n] — an edition ordinal; a 4-digit value is a YEAR
        // ("OIML D 2 Edition 1999 (E)", the printed bibliography form)
        if (peek()?.kind === 'word' && peek().value.toLowerCase() === 'edition' && t[i + 1]?.kind === 'num') {
            eat();
            const v = eat().value;
            if (v.length === 4)
                year ??= v;
            else
                edition ??= v;
            continue;
        }
        break;
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
        ...(language ? { language } : {}),
    };
}
/** The OIML URN convention, composed from the parsed structure:
 *  pub series → urn:oiml:pub:{family}:{number}[-{part}][:{year}][:{language}]
 *  cs series  → urn:oiml:pub:cs:{family}-{number}[:{year}][:{language}] */
function urnForOimlPubid(pubid) {
    const year = pubid.year ? `:${pubid.year}` : '';
    const lang = pubid.language ? `:${pubid.language}` : '';
    if (pubid.series === 'cs') {
        return `urn:oiml:pub:cs:${pubid.family}-${pubid.number}${year}${lang}`;
    }
    const part = pubid.part ? `-${pubid.part}` : '';
    return `urn:oiml:pub:${pubid.family}:${pubid.number}${part}${year}${lang}`;
}
/** The one-call convenience: identifier (+ optional bibdata year) →
 *  the URN, or null when the identifier is not an OIML pubid. */
function urnForIdentifier(src, bibdataYear = '') {
    const pubid = parseOimlPubid(src, bibdataYear);
    return pubid ? urnForOimlPubid(pubid) : null;
}
//# sourceMappingURL=index.js.map