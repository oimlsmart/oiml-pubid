"use strict";
// ─────────────────────────────────────────────────────────────────────
// The URN conformance corpus runner (TODO.FULL/08): one corpus, one
// runner, zero inline expectations anywhere. The package's own CI and
// every consumer's CI run this; a failure list of zero means conformant.
// ─────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.corpusResults = corpusResults;
const urn_corpus_data_js_1 = require("./urn-corpus-data.js");
const urn_js_1 = require("./urn.js");
function deepEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}
/** Run every corpus entry against the real functions. Returns the
 *  failure descriptions — an empty list is the pass. */
function corpusResults() {
    const c = urn_corpus_data_js_1.URN_CORPUS;
    const failures = [];
    const check = (name, actual, expected) => {
        if (!deepEqual(actual, expected)) {
            failures.push(`${name}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
    };
    for (const p of c.parse) {
        const parsed = (0, urn_js_1.parseOimlUrn)(p.urn);
        if (!parsed) {
            failures.push(`parse ${p.urn}: expected a parse, got null`);
            continue;
        }
        if (p.doctype !== undefined)
            check(`parse ${p.urn} doctype`, parsed.doctype, p.doctype);
        if (p.docnumber !== undefined)
            check(`parse ${p.urn} docnumber`, parsed.docnumber, p.docnumber);
        if (p.year !== undefined)
            check(`parse ${p.urn} year`, parsed.year, p.year);
        if (p.fragment !== undefined) {
            if (p.fragment === null)
                check(`parse ${p.urn} fragment`, parsed.fragment ?? null, null);
            else {
                const f = p.fragment;
                for (const [k, v] of Object.entries(f)) {
                    const actual = parsed.fragment?.[k];
                    check(`parse ${p.urn} fragment.${k}`, actual, v);
                }
            }
        }
        if (p.smartArtifact !== undefined) {
            if (p.smartArtifact === null)
                check(`parse ${p.urn} smartArtifact`, parsed.smartArtifact ?? null, null);
            else {
                const sa = p.smartArtifact;
                if (sa.artifactType !== undefined)
                    check(`parse ${p.urn} smartArtifact.type`, parsed.smartArtifact?.artifactType, sa.artifactType);
                if (sa.path !== undefined)
                    check(`parse ${p.urn} smartArtifact.path`, parsed.smartArtifact?.path, sa.path);
            }
        }
    }
    for (const r of c.reject) {
        check(`reject ${JSON.stringify(r)}`, (0, urn_js_1.parseOimlUrn)(r), null);
    }
    for (const rt of c.roundTrips) {
        const parsed = (0, urn_js_1.parseOimlUrn)(rt);
        if (!parsed) {
            failures.push(`round-trip ${rt}: parse returned null`);
            continue;
        }
        check(`round-trip ${rt}`, (0, urn_js_1.formatOimlUrn)(parsed), rt);
    }
    for (const cit of c.citations) {
        check(`citation ${cit.urn}`, (0, urn_js_1.urnToCitation)(cit.urn), cit.full);
        if (cit.short !== undefined)
            check(`short citation ${cit.urn}`, (0, urn_js_1.urnToShortCitation)(cit.urn), cit.short);
    }
    const fns = {
        buildClauseUrn: urn_js_1.buildClauseUrn, buildTableUrn: urn_js_1.buildTableUrn, buildTermUrn: urn_js_1.buildTermUrn, buildReqUrn: urn_js_1.buildReqUrn, buildConfUrn: urn_js_1.buildConfUrn,
    };
    for (const b of c.builders) {
        check(`builder ${b.fn}`, fns[b.fn](...b.args), b.expect);
    }
    for (const d of c.derives) {
        check(`derive ${d.internal} on ${d.base}`, (0, urn_js_1.deriveUrn)(d.base, d.internal), d.expect);
    }
    for (const iu of c.isOimlUrn) {
        check(`isOimlUrn ${JSON.stringify(iu.urn)}`, (0, urn_js_1.isOimlUrn)(iu.urn), iu.expect);
    }
    for (const dl of c.doctypeLabels) {
        check(`doctypeLabel ${dl.doctype}`, (0, urn_js_1.doctypeLabel)(dl.doctype), dl.label);
    }
    return failures;
}
//# sourceMappingURL=urn-corpus.js.map