# @oimlsmart/oiml-pubid

The OIML publication identifier system — **the single source of
truth** for parsing OIML document identifiers and minting their URNs.
Every OIML SMART consumer (Primmel Studio, the smart platform, the
docs sites) imports from this package. Nothing reimplements; nobody
pins their own expectations — the conformance corpus is shared.

## What it is

- `parseOimlPubid(src, bibdataYear?) → OimlPubid | null` — a real
  tokenizer + recursive-descent grammar (never a regex). Parses the
  publication families (R, B, D, G, E, V) and the OIML-CS family
  (PD, OD, CID) with parts, years, editions, and amendments;
  returns null for non-OIML shapes.
- `urnForOimlPubid(pubid) → string` — the OIML URN convention,
  composed from the parsed structure:
  - pub series → `urn:oiml:pub:{family}:{number}[-{part}][:{year}]`
  - CS series → `urn:oiml:pub:cs:{family}-{number}[:{year}]`
- `urnForIdentifier(src, bibdataYear?) → string | null` — the
  one-call convenience.
- `conformance/identifiers.json` — **the shared expectations.** Every
  consumer's tests run against this file; nobody pins their own
  copies. The package's own suite is proof it stays honest.

## The grammar

```
pubid      := "OIML" ["-CS"] family number ["-" part] [":" year]
              ["(" lang ")"] ["Edition" n] ["(Amendment" n ")"]
family     := "R" | "B" | "D" | "G" | "E" | "V"   (publications)
family     := "PD" | "OD" | "CID"                  (the CS family)
number     := digits · part := digits · year := 4 digits
lang       := "(" letter+ ")"       e.g. (E), (F), (E/F)
"Edition"  := n                    e.g. Edition 6
amendment  := "(Amendment" n ")"
```

## The instrument segment (TODO.register/04)

Additive to the grammar — the per-serial identity of one registered
instrument, never a reinterpretation of the publication identifiers
above (`src/instrument.ts`, `./instrument`):

```
instrument := "urn:oiml:instrument:" authority ":" holder ":" certificate ":" serial
link       := "/i/" authority "/" holder "/" certificate "/" serial
authority  := the scheme authority operating the register (the register
              operator's federation instance id, e.g. oiml-cs-hub)
holder     := the holder organization id (the identity plane's org id)
certificate := the certificate number the serial rides under
serial     := the serial number
```

Every segment is pct-encoded individually (the keep-set is the URI
unreserved characters), so a certificate number's `/` or a serial's
`:` never splits the grammar. The link form is the GS1 Digital Link
pattern: the serialized code on the rating plate resolves
(`/i/<serial-identity>`) on the register's public origin.

- `mintInstrumentUrn(parts)` / `instrumentLinkPath(parts)` — the two
  canonical forms (a malformed mint — an empty segment — throws).
- `parseInstrumentUrn(src)` / `parseInstrumentLinkPath(path)` — null
  for every malformed shape.
- `conformance/instruments.json` — the shared expectations for the
  segment (`@oimlsmart/oiml-pubid/conformance/instruments`).

## Usage

```ts
import { parseOimlPubid, urnForOimlPubid, urnForIdentifier } from '@oimlsmart/oiml-pubid';
import corpus from '@oimlsmart/oiml-pubid/conformance';

urnForIdentifier('OIML B 18:2025(E)')              // urn:oiml:pub:b:18:2025
urnForIdentifier('OIML R 7', '1979')               // urn:oiml:pub:r:7:1979
urnForIdentifier('OIML-CS PD-05 Edition 6', '2024') // urn:oiml:pub:cs:pd-05:2024

// The conformance corpus in your own tests:
for (const c of corpus.cases) {
  assert.equal(urnForIdentifier(c.identifier, c.bibdataYear ?? ''), c.urn);
}
```

## Gates

```bash
npm run build   # tsc + the browser bundle (vite)
npm test        # the conformance suite (node:test over the corpus)
```
