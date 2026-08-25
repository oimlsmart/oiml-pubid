import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  mintInstrumentUrn,
  parseInstrumentUrn,
  instrumentLinkPath,
  parseInstrumentLinkPath,
} from '../src/instrument.js';
import { parseOimlUrn } from '../src/urn.js';
import { parseOimlPubid } from '../src/index.js';

// ─────────────────────────────────────────────────────────────────────
// The instrument-identity conformance suite (TODO.register/04) — it
// runs THE corpus (conformance/instruments.json); consumers import the
// same file. Nothing pins its own expectations.
// ─────────────────────────────────────────────────────────────────────

const corpus = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '../conformance/instruments.json'),
    'utf8',
  ),
);

describe('the instrument-identity conformance corpus', () => {
  for (const c of corpus.cases) {
    it(`mints ${c.urn}`, () => {
      assert.equal(mintInstrumentUrn(c.parts), c.urn);
      assert.equal(instrumentLinkPath(c.parts), c.path);
    });
    it(`parses ${c.urn} back to the same parts`, () => {
      assert.deepEqual(parseInstrumentUrn(c.urn), c.parts);
      assert.deepEqual(parseInstrumentLinkPath(c.path), c.parts);
    });
    it(`round-trips ${c.urn} byte-identically`, () => {
      const parsed = parseInstrumentUrn(c.urn);
      assert.ok(parsed);
      assert.equal(mintInstrumentUrn(parsed), c.urn);
      const parsedPath = parseInstrumentLinkPath(c.path);
      assert.ok(parsedPath);
      assert.equal(instrumentLinkPath(parsedPath), c.path);
    });
  }

  for (const r of corpus.rejectUrns) {
    it(`refuses the malformed URN ${JSON.stringify(r)}`, () => {
      assert.equal(parseInstrumentUrn(r), null);
    });
  }
  for (const r of corpus.rejectPaths) {
    it(`refuses the malformed link path ${JSON.stringify(r)}`, () => {
      assert.equal(parseInstrumentLinkPath(r), null);
    });
  }
});

describe('the additive posture (never a reinterpretation)', () => {
  it('an instrument URN never parses as a publication', () => {
    const urn = mintInstrumentUrn(corpus.cases[0].parts);
    assert.equal(parseOimlUrn(urn), null);
    assert.equal(parseOimlPubid(urn), null);
  });
  it('a publication identifier never parses as an instrument identity', () => {
    assert.equal(parseInstrumentUrn('urn:oiml:pub:r:60:2021'), null);
    assert.equal(parseInstrumentUrn('urn:oiml:pub:cs:pd-05:2024'), null);
  });
});

describe('the mint refuses the malformed segment loudly', () => {
  it('an empty segment throws (a malformed mint is a programmer error)', () => {
    const good = corpus.cases[0].parts;
    assert.throws(() => mintInstrumentUrn({ ...good, serial: '' }), TypeError);
    assert.throws(() => instrumentLinkPath({ ...good, holder: '' }), TypeError);
  });
});
