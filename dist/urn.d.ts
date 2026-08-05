export interface OimlUrn {
    doctype: string;
    docnumber: string;
    year?: string;
    language?: string;
    fragment?: OimlUrnFragment;
    smartArtifact?: OimlSmartArtifact;
}
export type OimlUrnFragment = {
    kind: 'physical';
    type: string;
    number: string;
} | {
    kind: 'term';
    id: string;
};
export interface OimlSmartArtifact {
    artifactType: string;
    path: string[];
}
export declare function isOimlUrn(value: string): boolean;
export declare function parseOimlUrn(urn: string): OimlUrn | null;
export declare function formatOimlUrn(parts: OimlUrn): string;
export declare function urnToCitation(urn: string): string;
export declare function urnToShortCitation(urn: string, contextDocnumber?: string): string;
export declare function urnToSmartIdentifier(urn: string): string | undefined;
export declare function buildUrn(doctype: string, docnumber: string, year?: string, fragment?: OimlUrnFragment, smartArtifact?: OimlSmartArtifact): string;
export declare function buildClauseUrn(doctype: string, docnumber: string, year: string, clause: string): string;
export declare function buildTableUrn(doctype: string, docnumber: string, year: string, tableNum: string): string;
export declare function buildTermUrn(doctype: string, docnumber: string, year: string, termId: string): string;
export declare function buildReqUrn(doctype: string, docnumber: string, year: string, reqClass: string, reqId: string): string;
export declare function buildConfUrn(doctype: string, docnumber: string, year: string, confClass: string, confId: string): string;
export declare function deriveUrn(baseUrn: string, internalId: string): string | null;
export declare function doctypeLabel(doctype: string): string;
//# sourceMappingURL=urn.d.ts.map