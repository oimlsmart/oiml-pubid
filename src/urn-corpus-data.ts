// ─────────────────────────────────────────────────────────────────────
// The URN conformance corpus (TODO.FULL/08) — THE one home of every
// expectation. conformance/urn.json is GENERATED from this module
// (scripts/sync-urn-json.ts); never edit the JSON by hand.
// ─────────────────────────────────────────────────────────────────────

export interface UrnCorpus {
  parse: Array<{ urn: string; doctype?: string; docnumber?: string; year?: string; fragment?: unknown; smartArtifact?: unknown }>
  reject: string[]
  roundTrips: string[]
  citations: Array<{ urn: string; full: string; short?: string }>
  builders: Array<{ fn: string; args: string[]; expect: string }>
  derives: Array<{ base: string; internal: string; expect: string | null }>
  isOimlUrn: Array<{ urn: string; expect: boolean }>
  doctypeLabels: Array<{ doctype: string; label: string }>
}

export const URN_CORPUS: UrnCorpus = {
  "parse": [
    {
      "urn": "urn:oiml:pub:r:60:2021",
      "doctype": "r",
      "docnumber": "60",
      "year": "2021",
      "fragment": null,
      "smartArtifact": null
    },
    {
      "urn": "urn:oiml:pub:r:60-1:2021",
      "doctype": "r",
      "docnumber": "60-1",
      "year": "2021"
    },
    {
      "urn": "urn:oiml:pub:r:60-1:2021#clause-5.4",
      "fragment": {
        "kind": "physical",
        "type": "clause",
        "number": "5.4"
      }
    },
    {
      "urn": "urn:oiml:pub:r:60-1:2021#tabl-4",
      "fragment": {
        "kind": "physical",
        "type": "tabl",
        "number": "4"
      }
    },
    {
      "urn": "urn:oiml:pub:r:60:2021#term/creep",
      "fragment": {
        "kind": "term",
        "id": "creep"
      }
    },
    {
      "urn": "urn:oiml:pub:r:60:2021:req:/metrological/mpe",
      "smartArtifact": {
        "artifactType": "req",
        "path": [
          "metrological",
          "mpe"
        ]
      }
    },
    {
      "urn": "urn:oiml:pub:r:60:2021:conf:/metrological-tests/creep",
      "smartArtifact": {
        "artifactType": "conf",
        "path": [
          "metrological-tests",
          "creep"
        ]
      }
    },
    {
      "urn": "urn:oiml:pub:r:60:2021:trf:/load-test",
      "smartArtifact": {
        "artifactType": "trf",
        "path": [
          "load-test"
        ]
      }
    },
    {
      "urn": "urn:oiml:pub:r:60:2021:reqclass:/metrological",
      "smartArtifact": {
        "artifactType": "reqclass",
        "path": [
          "metrological"
        ]
      }
    },
    {
      "urn": "urn:oiml:pub:r:60:2021:confclass:/metrological-tests",
      "smartArtifact": {
        "artifactType": "confclass",
        "path": [
          "metrological-tests"
        ]
      }
    },
    {
      "urn": "urn:oiml:pub:r:60:2021:trd:/r60-3-test-report",
      "smartArtifact": {
        "artifactType": "trd",
        "path": [
          "r60-3-test-report"
        ]
      }
    },
    {
      "urn": "urn:oiml:pub:v:1:2013#clause-5.15",
      "doctype": "v",
      "docnumber": "1",
      "year": "2013"
    },
    {
      "urn": "urn:oiml:pub:cs:pd-02:2022",
      "doctype": "cs",
      "docnumber": "pd-02",
      "year": "2022",
      "fragment": null
    },
    {
      "urn": "urn:oiml:pub:cs:od-01:2022#contents",
      "fragment": {
        "kind": "physical",
        "type": "contents",
        "number": ""
      }
    },
    {
      "urn": "urn:oiml:pub:cs:od-01:2022#clause-7.2",
      "doctype": "cs",
      "fragment": {
        "kind": "physical",
        "type": "clause",
        "number": "7.2"
      }
    }
  ],
  "reject": [
    "urn:oiml:pub:cs:32:2018",
    "urn:oiml:pub:cs:pd-2:2022",
    "urn:oiml:pub:csx:pd-02:2022",
    "urn:iec:std:iec:60601",
    "not-a-urn",
    "",
    "urn:oiml:r:60:2021"
  ],
  "roundTrips": [
    "urn:oiml:pub:r:60-1:2021#clause-5.4",
    "urn:oiml:pub:r:60:2021:req:/metrological/mpe",
    "urn:oiml:pub:r:60:2021:conf:/metrological-tests/creep",
    "urn:oiml:pub:r:60:2021:trf:/load-test",
    "urn:oiml:pub:r:60:2021:reqclass:/metrological",
    "urn:oiml:pub:r:60:2021",
    "urn:oiml:pub:cs:od-01:2022#contents",
    "urn:oiml:pub:r:60:2021#term/creep"
  ],
  "citations": [
    {
      "urn": "urn:oiml:pub:r:60:2021",
      "full": "OIML R 60:2021"
    },
    {
      "urn": "urn:oiml:pub:r:60-1:2021",
      "full": "OIML R 60-1:2021"
    },
    {
      "urn": "urn:oiml:pub:r:60-1:2021#clause-5.4",
      "full": "OIML R 60-1:2021, 5.4",
      "short": "R 60-1, 5.4"
    },
    {
      "urn": "urn:oiml:pub:r:60-1:2021#tabl-4",
      "full": "OIML R 60-1:2021, Table 4",
      "short": "R 60-1, Table 4"
    },
    {
      "urn": "urn:oiml:pub:r:60-1:2021#fig-1",
      "full": "OIML R 60-1:2021, Figure 1"
    },
    {
      "urn": "urn:oiml:pub:r:60-1:2021#anx-A",
      "full": "OIML R 60-1:2021, Annex A"
    },
    {
      "urn": "urn:oiml:pub:r:60:2021#term/creep",
      "full": "OIML R 60:2021, term \"creep\""
    },
    {
      "urn": "urn:oiml:pub:v:1:2013#clause-5.15",
      "full": "OIML V 1:2013, 5.15"
    },
    {
      "urn": "urn:oiml:pub:r:60:2021:req:/metrological/mpe",
      "full": "OIML R 60:2021 [SMART req/metrological/mpe]",
      "short": "req/metrological/mpe"
    },
    {
      "urn": "not-a-urn",
      "full": "not-a-urn"
    }
  ],
  "builders": [
    {
      "fn": "buildClauseUrn",
      "args": [
        "r",
        "60-1",
        "2021",
        "5.4"
      ],
      "expect": "urn:oiml:pub:r:60-1:2021#clause-5.4"
    },
    {
      "fn": "buildTableUrn",
      "args": [
        "r",
        "60-1",
        "2021",
        "4"
      ],
      "expect": "urn:oiml:pub:r:60-1:2021#tabl-4"
    },
    {
      "fn": "buildTermUrn",
      "args": [
        "r",
        "60",
        "2021",
        "creep"
      ],
      "expect": "urn:oiml:pub:r:60:2021#term/creep"
    },
    {
      "fn": "buildReqUrn",
      "args": [
        "r",
        "60",
        "2021",
        "metrological",
        "mpe"
      ],
      "expect": "urn:oiml:pub:r:60:2021:req:/metrological/mpe"
    },
    {
      "fn": "buildConfUrn",
      "args": [
        "r",
        "60",
        "2021",
        "metrological-tests",
        "creep"
      ],
      "expect": "urn:oiml:pub:r:60:2021:conf:/metrological-tests/creep"
    }
  ],
  "derives": [
    {
      "base": "urn:oiml:pub:r:60:2021",
      "internal": "/req/metrological",
      "expect": "urn:oiml:pub:r:60:2021:reqclass:/metrological"
    },
    {
      "base": "urn:oiml:pub:r:60:2021",
      "internal": "/req/metrological/mpe",
      "expect": "urn:oiml:pub:r:60:2021:req:/metrological/mpe"
    },
    {
      "base": "urn:oiml:pub:r:60:2021",
      "internal": "/conf/metrological-tests",
      "expect": "urn:oiml:pub:r:60:2021:confclass:/metrological-tests"
    },
    {
      "base": "urn:oiml:pub:r:60:2021",
      "internal": "/conf/metrological-tests/creep",
      "expect": "urn:oiml:pub:r:60:2021:conf:/metrological-tests/creep"
    },
    {
      "base": "urn:oiml:pub:r:60:2021",
      "internal": "/trd/r60-3-test-report",
      "expect": "urn:oiml:pub:r:60:2021:trd:/r60-3-test-report"
    },
    {
      "base": "urn:oiml:pub:r:60:2021",
      "internal": "/trf/load-test",
      "expect": "urn:oiml:pub:r:60:2021:trf:/load-test"
    },
    {
      "base": "urn:oiml:pub:r:60:2021",
      "internal": "no-slash",
      "expect": null
    },
    {
      "base": "urn:oiml:pub:r:60:2021",
      "internal": "/unknown/foo",
      "expect": null
    },
    {
      "base": "not-a-urn",
      "internal": "/req/foo",
      "expect": null
    }
  ],
  "isOimlUrn": [
    {
      "urn": "urn:oiml:pub:r:60:2021",
      "expect": true
    },
    {
      "urn": "urn:oiml:pub:r:60-1:2021#clause-5.4",
      "expect": true
    },
    {
      "urn": "urn:oiml:pub:r:60:2021:req:/metrological/mpe",
      "expect": true
    },
    {
      "urn": "R 60-1, 5.4",
      "expect": false
    },
    {
      "urn": "",
      "expect": false
    }
  ],
  "doctypeLabels": [
    {
      "doctype": "r",
      "label": "Recommendation"
    },
    {
      "doctype": "d",
      "label": "Document"
    },
    {
      "doctype": "v",
      "label": "Vocabulary"
    },
    {
      "doctype": "b",
      "label": "Basic Publication"
    }
  ]
}
