export interface UrnCorpus {
    parse: Array<{
        urn: string;
        doctype?: string;
        docnumber?: string;
        year?: string;
        fragment?: unknown;
        smartArtifact?: unknown;
    }>;
    reject: string[];
    roundTrips: string[];
    citations: Array<{
        urn: string;
        full: string;
        short?: string;
    }>;
    builders: Array<{
        fn: string;
        args: string[];
        expect: string;
    }>;
    derives: Array<{
        base: string;
        internal: string;
        expect: string | null;
    }>;
    isOimlUrn: Array<{
        urn: string;
        expect: boolean;
    }>;
    doctypeLabels: Array<{
        doctype: string;
        label: string;
    }>;
}
export declare const URN_CORPUS: UrnCorpus;
//# sourceMappingURL=urn-corpus-data.d.ts.map