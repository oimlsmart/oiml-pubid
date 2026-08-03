import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseOimlPubid, urnForOimlPubid } from '../src/index.js';

// ─────────────────────────────────────────────────────────────────────
// The conformance suite — it runs THE corpus (conformance/
// identifiers.json), the package's own expectations. Consumers import
// the same corpus; nobody pins their own copies.
// ─────────────────────────────────────────────────────────────────────

const corpus = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '../conformance/identifiers.json'),
    'utf8',
  ),
);

describe('the conformance corpus', () => {
  for (const c of corpus.cases) {
    it(`parses ${c.identifier} into its structure`, () => {
      const parsed = parseOimlPubid(c.identifier, c.bibdataYear ?? '');
      assert.ok(parsed, `expected ${c.identifier} to parse`);
      for (const [key, value] of Object.entries(c.structure)) {
        assert.equal(
          parsed[key],
          value,
          `${c.identifier}: expected ${key} to be ${value}, got ${parsed[key]}`,
        );
      }
    });

    it(`mints ${c.urn} from ${c.identifier}`, () => {
      const parsed = parseOimlPubid(c.identifier, c.bibdataYear ?? '');
      assert.ok(parsed);
      assert.equal(urnForOimlPubid(parsed), c.urn);
    });
  }

  for (const r of corpus.rejections) {
    it(`rejects ${r}`, () => {
      assert.equal(parseOimlPubid(r), null);
    });
  }
});
