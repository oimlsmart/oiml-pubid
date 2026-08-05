// ─────────────────────────────────────────────────────────────────────
// The URN conformance corpus runner (TODO.FULL/08): one corpus, one
// runner, zero inline expectations anywhere. The package's own CI and
// every consumer's CI run this; a failure list of zero means conformant.
// ─────────────────────────────────────────────────────────────────────

import { URN_CORPUS, type UrnCorpus } from './urn-corpus-data.js'
import {
  parseOimlUrn,
  formatOimlUrn,
  urnToCitation,
  urnToShortCitation,
  isOimlUrn,
  buildClauseUrn,
  buildTableUrn,
  buildTermUrn,
  buildReqUrn,
  buildConfUrn,
  deriveUrn,
  doctypeLabel,
} from './urn.js'

interface Corpus {
  parse: Array<{ urn: string; doctype?: string; docnumber?: string; year?: string; fragment?: unknown; smartArtifact?: unknown }>
  reject: string[]
  roundTrips: string[]
  citations: Array<{ urn: string; full: string; short?: string }>
  builders: Array<{ fn: string; args: string[]; expect: string }>
  derives: Array<{ base: string; internal: string; expect: string | null }>
  isOimlUrn: Array<{ urn: string; expect: boolean }>
  doctypeLabels: Array<{ doctype: string; label: string }>
}


function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

/** Run every corpus entry against the real functions. Returns the
 *  failure descriptions — an empty list is the pass. */
export function corpusResults(): string[] {
  const c = URN_CORPUS
  const failures: string[] = []
  const check = (name: string, actual: unknown, expected: unknown) => {
    if (!deepEqual(actual, expected)) {
      failures.push(`${name}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
    }
  }

  for (const p of c.parse) {
    const parsed = parseOimlUrn(p.urn)
    if (!parsed) { failures.push(`parse ${p.urn}: expected a parse, got null`); continue }
    if (p.doctype !== undefined) check(`parse ${p.urn} doctype`, parsed.doctype, p.doctype)
    if (p.docnumber !== undefined) check(`parse ${p.urn} docnumber`, parsed.docnumber, p.docnumber)
    if (p.year !== undefined) check(`parse ${p.urn} year`, parsed.year, p.year)
    if (p.fragment !== undefined) {
      if (p.fragment === null) check(`parse ${p.urn} fragment`, parsed.fragment ?? null, null)
      else {
        const f = p.fragment as Record<string, unknown>
        for (const [k, v] of Object.entries(f)) {
          const actual = (parsed.fragment as Record<string, unknown> | undefined)?.[k]
          check(`parse ${p.urn} fragment.${k}`, actual, v)
        }
      }
    }
    if (p.smartArtifact !== undefined) {
      if (p.smartArtifact === null) check(`parse ${p.urn} smartArtifact`, parsed.smartArtifact ?? null, null)
      else {
        const sa = p.smartArtifact as { artifactType?: string; path?: string[] }
        if (sa.artifactType !== undefined) check(`parse ${p.urn} smartArtifact.type`, parsed.smartArtifact?.artifactType, sa.artifactType)
        if (sa.path !== undefined) check(`parse ${p.urn} smartArtifact.path`, parsed.smartArtifact?.path, sa.path)
      }
    }
  }

  for (const r of c.reject) {
    check(`reject ${JSON.stringify(r)}`, parseOimlUrn(r), null)
  }

  for (const rt of c.roundTrips) {
    const parsed = parseOimlUrn(rt)
    if (!parsed) { failures.push(`round-trip ${rt}: parse returned null`); continue }
    check(`round-trip ${rt}`, formatOimlUrn(parsed), rt)
  }

  for (const cit of c.citations) {
    check(`citation ${cit.urn}`, urnToCitation(cit.urn), cit.full)
    if (cit.short !== undefined) check(`short citation ${cit.urn}`, urnToShortCitation(cit.urn), cit.short)
  }

  const fns: Record<string, (...args: string[]) => string> = {
    buildClauseUrn, buildTableUrn, buildTermUrn, buildReqUrn, buildConfUrn,
  }
  for (const b of c.builders) {
    check(`builder ${b.fn}`, fns[b.fn](...b.args), b.expect)
  }

  for (const d of c.derives) {
    check(`derive ${d.internal} on ${d.base}`, deriveUrn(d.base, d.internal), d.expect)
  }

  for (const iu of c.isOimlUrn) {
    check(`isOimlUrn ${JSON.stringify(iu.urn)}`, isOimlUrn(iu.urn), iu.expect)
  }

  for (const dl of c.doctypeLabels) {
    check(`doctypeLabel ${dl.doctype}`, doctypeLabel(dl.doctype), dl.label)
  }

  return failures
}
