import { test } from 'node:test'
import assert from 'node:assert/strict'
import { corpusResults } from '../src/urn-corpus.ts'

test('the URN conformance corpus — every entry conforms', () => {
  assert.deepEqual(corpusResults(), [])
})
