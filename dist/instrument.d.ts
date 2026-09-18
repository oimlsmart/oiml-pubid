/** The four segments of one instrument identity. */
export interface OimlInstrumentId {
    /** The scheme authority operating the register (the register
     *  operator's federation instance id). */
    authority: string;
    /** The holder organization id (the identity plane's org id). */
    holder: string;
    /** The certificate number the serial rides under. */
    certificate: string;
    /** The serial number. */
    serial: string;
}
export declare const INSTRUMENT_URN_PREFIX = "urn:oiml:instrument:";
export declare const INSTRUMENT_LINK_PREFIX = "/i/";
/** Mint the canonical URN: urn:oiml:instrument:a:h:c:s with each
 *  segment pct-encoded. Throws TypeError on an empty segment (a
 *  malformed mint is a programmer error, never a runtime guess). */
export declare function mintInstrumentUrn(id: OimlInstrumentId): string;
/** Parse the canonical URN form. Null for every other shape — a
 *  publication URN, a wrong segment count, an empty segment, a
 *  malformed pct-encoding. */
export declare function parseInstrumentUrn(src: string): OimlInstrumentId | null;
/** Mint the resolver link path (the GS1 Digital Link pattern):
 *  /i/{authority}/{holder}/{certificate}/{serial}. */
export declare function instrumentLinkPath(id: OimlInstrumentId): string;
/** Parse the resolver link path (the raw, still-encoded URL path).
 *  Null for every other shape. */
export declare function parseInstrumentLinkPath(path: string): OimlInstrumentId | null;
//# sourceMappingURL=instrument.d.ts.map