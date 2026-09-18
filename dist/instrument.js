"use strict";
// ─────────────────────────────────────────────────────────────────────
// The OIML INSTRUMENT identifier — the per-serial identity segment of
// the pubid grammar (TODO.register/04: the global instrument register's
// resolvable identity, docs/future/08 item 4).
//
// One registered instrument (one serial number riding under one type
// certificate, held by one organization, on one scheme authority's
// register) is identified by FOUR segments:
//
//   authority     the scheme authority operating the register (the
//                 register operator's federation instance id, e.g.
//                 'oiml-cs-hub')
//   holder        the holder organization id (the identity plane's org
//                 id — it crosses instances unchanged)
//   certificate   the certificate number the serial rides under (e.g.
//                 'R60/2021-A-EX1-26.01')
//   serial        the serial number
//
// Two surface forms, ONE grammar:
//
//   the URN      urn:oiml:instrument:{authority}:{holder}:{certificate}:{serial}
//   the link     /i/{authority}/{holder}/{certificate}/{serial}
//                (the GS1 Digital Link pattern: the serialized code on
//                the instrument's rating plate resolves on the
//                register's public origin)
//
// Segments are pct-encoded individually (the keep-set is the URI
// unreserved characters, [A-Za-z0-9._~-]); a certificate number's '/'
// or a serial's ':' never splits the grammar. The parse refuses every
// malformed shape with null — never a guess.
//
// ADDITIVE, never a reinterpretation: the 'instrument' resource class
// is new; parseOimlUrn keeps requiring the 'pub:' class and the
// publication grammar is untouched (the conformance corpus proves both
// directions).
// ─────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSTRUMENT_LINK_PREFIX = exports.INSTRUMENT_URN_PREFIX = void 0;
exports.mintInstrumentUrn = mintInstrumentUrn;
exports.parseInstrumentUrn = parseInstrumentUrn;
exports.instrumentLinkPath = instrumentLinkPath;
exports.parseInstrumentLinkPath = parseInstrumentLinkPath;
exports.INSTRUMENT_URN_PREFIX = 'urn:oiml:instrument:';
exports.INSTRUMENT_LINK_PREFIX = '/i/';
// ── the segment codec ────────────────────────────────────────────────
/** The keep-set is the URI unreserved characters; encodeURIComponent
 *  additionally leaves !'()* raw, which URN/URL grammars treat
 *  unevenly — encode those too, so a segment is opaque in every
 *  carrier. */
function encodeSegment(segment) {
    return encodeURIComponent(segment).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}
/** Decode one segment; null on a malformed pct-encoding (never a
 *  partial decode). */
function decodeSegment(segment) {
    try {
        return decodeURIComponent(segment);
    }
    catch {
        return null;
    }
}
/** The segments of a joined identity string, split on the RAW
 *  separator (an encoded %3A / %2F inside a segment never splits).
 *  Null when the count is not exactly four or a segment is empty or
 *  undecodable. */
function splitSegments(body, separator) {
    const parts = body.split(separator);
    if (parts.length !== 4)
        return null;
    const decoded = parts.map(decodeSegment);
    if (decoded.some((d) => d === null || d === ''))
        return null;
    const [authority, holder, certificate, serial] = decoded;
    return { authority, holder, certificate, serial };
}
// ── mint + parse ─────────────────────────────────────────────────────
function assertSegments(id) {
    for (const [name, value] of Object.entries(id)) {
        if (typeof value !== 'string' || !value) {
            throw new TypeError(`the instrument identity's ${name} segment must be a non-empty string`);
        }
    }
}
/** Mint the canonical URN: urn:oiml:instrument:a:h:c:s with each
 *  segment pct-encoded. Throws TypeError on an empty segment (a
 *  malformed mint is a programmer error, never a runtime guess). */
function mintInstrumentUrn(id) {
    assertSegments(id);
    return (exports.INSTRUMENT_URN_PREFIX +
        [id.authority, id.holder, id.certificate, id.serial].map(encodeSegment).join(':'));
}
/** Parse the canonical URN form. Null for every other shape — a
 *  publication URN, a wrong segment count, an empty segment, a
 *  malformed pct-encoding. */
function parseInstrumentUrn(src) {
    if (!src.startsWith(exports.INSTRUMENT_URN_PREFIX))
        return null;
    return splitSegments(src.slice(exports.INSTRUMENT_URN_PREFIX.length), ':');
}
/** Mint the resolver link path (the GS1 Digital Link pattern):
 *  /i/{authority}/{holder}/{certificate}/{serial}. */
function instrumentLinkPath(id) {
    assertSegments(id);
    return (exports.INSTRUMENT_LINK_PREFIX +
        [id.authority, id.holder, id.certificate, id.serial].map(encodeSegment).join('/'));
}
/** Parse the resolver link path (the raw, still-encoded URL path).
 *  Null for every other shape. */
function parseInstrumentLinkPath(path) {
    if (!path.startsWith(exports.INSTRUMENT_LINK_PREFIX))
        return null;
    return splitSegments(path.slice(exports.INSTRUMENT_LINK_PREFIX.length), '/');
}
//# sourceMappingURL=instrument.js.map