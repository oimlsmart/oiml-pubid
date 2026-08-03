export interface OimlPubid {
    /** 'pub' for the publication families, 'cs' for the CS family. */
    series: 'pub' | 'cs';
    /** The family token, lowercased: 'r', 'b', 'd', 'g', 'e', 'v', 'pd', 'od', 'cid'. */
    family: string;
    /** The document number as authored ('60', '7', '05', '01'). */
    number: string;
    /** The part number when authored ('2' in R 60-2). */
    part?: string;
    /** The year (from the identifier, else the bibdata date). */
    year?: string;
    /** The edition number (CS family). */
    edition?: string;
    /** The amendment number (CS family). */
    amendment?: string;
}
/** Parse an OIML publication identifier. Returns null when the shape
 *  is not an OIML pubid (the caller decides the fallback). */
export declare function parseOimlPubid(src: string, bibdataYear?: string): OimlPubid | null;
/** The OIML URN convention, composed from the parsed structure:
 *  pub series → urn:oiml:pub:{family}:{number}[-{part}][:{year}]
 *  cs series  → urn:oiml:pub:cs:{family}-{number}[:{year}] */
export declare function urnForOimlPubid(pubid: OimlPubid): string;
/** The one-call convenience: identifier (+ optional bibdata year) →
 *  the URN, or null when the identifier is not an OIML pubid. */
export declare function urnForIdentifier(src: string, bibdataYear?: string): string | null;
//# sourceMappingURL=index.d.ts.map