// OIML URN Specification — parser, formatter, and citation derivation
// Spec: data/oiml-urn-specification.adoc
//
// Publications use the "pub:" resource class:
//   urn:oiml:pub:r:60:2021:req:/metrological/mpe
// Physical elements use fragment identifiers:
//   urn:oiml:pub:r:60-1:2021#clause-5.4
// Terms use fragment identifiers:
//   urn:oiml:pub:r:60:2021#term/creep

export interface OimlUrn {
  doctype: string
  docnumber: string
  year?: string
  language?: string
  fragment?: OimlUrnFragment
  smartArtifact?: OimlSmartArtifact
}

export type OimlUrnFragment =
  | { kind: 'physical'; type: string; number: string }
  | { kind: 'term'; id: string }

export interface OimlSmartArtifact {
  artifactType: string
  path: string[]
}

const URN_PREFIX = 'urn:oiml:'
const OIML_DOCTYPES = new Set(['r', 'd', 'b', 'v', 'g', 'e', 'cs'])
const PHYSICAL_TYPES = new Set(['clause', 'sec', 'fig', 'tabl', 'anx', 'note', 'contents'])
const SMART_TYPES = new Set(['reqclass', 'req', 'confclass', 'conf', 'trd', 'trf', 'eval'])

const DOCTYPE_LABELS: Record<string, string> = {
  r: 'Recommendation',
  d: 'Document',
  b: 'Basic Publication',
  v: 'Vocabulary',
  g: 'Guide',
  e: 'Expert Report',
  cs: 'Certification System Publication',
}

export function isOimlUrn(value: string): boolean {
  return value.startsWith(URN_PREFIX)
}

export function parseOimlUrn(urn: string): OimlUrn | null {
  if (!urn.startsWith(URN_PREFIX)) return null

  let body = urn.slice(URN_PREFIX.length)

  // Require resource class prefix (currently only 'pub:' for publications)
  if (!body.startsWith('pub:')) return null
  body = body.slice(4)

  // Split on # to separate fragment
  const hashIdx = body.indexOf('#')
  const mainPart = hashIdx >= 0 ? body.slice(0, hashIdx) : body
  const fragmentStr = hashIdx >= 0 ? body.slice(hashIdx + 1) : undefined

  // Split main NSS on :
  const parts = mainPart.split(':')
  if (parts.length < 2) return null

  const doctype = parts[0]
  const docnumber = parts[1]

  if (!OIML_DOCTYPES.has(doctype)) return null
  if (!docnumber) return null
  // OIML-CS publications carry the series-letter-prefixed cs-pub-number
  // form (spec: pd-02 / od-01 / cid-01); other doctypes stay
  // docnumber-agnostic (the parser's pre-existing discipline).
  if (doctype === 'cs' && !/^[a-z]+-\d{2}$/.test(docnumber)) return null

  // Remaining parts after doctype:docnumber
  const remaining = parts.slice(2)

  let year: string | undefined
  let language: string | undefined
  let smartArtifact: OimlSmartArtifact | undefined

  if (remaining.length > 0) {
    // Check if first remaining part is a year (4 digits)
    const firstPart = remaining[0]
    if (/^\d{4}$/.test(firstPart)) {
      year = firstPart
      const afterYear = remaining.slice(1)

      if (afterYear.length > 0) {
        // Check if next part is a SMART artifact type
        if (SMART_TYPES.has(afterYear[0])) {
          const artifactType = afterYear[0]
          const pathStr = afterYear.length > 1 ? afterYear.slice(1).join(':') : ''
          const path = pathStr.startsWith('/') ? pathStr.slice(1).split('/').filter(Boolean) : []
          smartArtifact = { artifactType, path }
        } else {
          // It's a language code
          language = afterYear.join(':')
        }
      }
    } else if (SMART_TYPES.has(firstPart)) {
      // No year, SMART artifact directly after docnumber
      const artifactType = firstPart
      const pathStr = remaining.length > 1 ? remaining.slice(1).join(':') : ''
      const path = pathStr.startsWith('/') ? pathStr.slice(1).split('/').filter(Boolean) : []
      smartArtifact = { artifactType, path }
    } else {
      // No year, treat as language
      language = remaining.join(':')
    }
  }

  // Parse fragment (physical element or term)
  let fragment: OimlUrnFragment | undefined
  if (fragmentStr) {
    fragment = parseFragment(fragmentStr)
  }

  return {
    doctype,
    docnumber,
    year: year || undefined,
    language: language || undefined,
    fragment,
    smartArtifact,
  }
}

function parseFragment(frag: string): OimlUrnFragment | undefined {
  // Term reference: term/{id}
  if (frag.startsWith('term/')) {
    return { kind: 'term', id: frag.slice(5) }
  }

  // Unnumbered front matter (spec: front-matter-element) — bare, no number
  if (frag === 'contents') {
    return { kind: 'physical', type: 'contents', number: '' }
  }

  // Physical element: type-number[.number...]
  const dashIdx = frag.indexOf('-')
  if (dashIdx > 0) {
    const type = frag.slice(0, dashIdx)
    const number = frag.slice(dashIdx + 1)
    if (PHYSICAL_TYPES.has(type)) {
      return { kind: 'physical', type, number }
    }
  }

  return undefined
}

export function formatOimlUrn(parts: OimlUrn): string {
  let urn = `${URN_PREFIX}pub:${parts.doctype}:${parts.docnumber}`
  if (parts.year) urn += `:${parts.year}`
  if (parts.language) urn += `:${parts.language}`

  if (parts.smartArtifact) {
    const sa = parts.smartArtifact
    const pathStr = sa.path.length > 0 ? `:/${sa.path.join('/')}` : ':/'
    urn += `:${sa.artifactType}${pathStr}`
  }

  if (parts.fragment) {
    urn += '#' + formatFragment(parts.fragment)
  }

  return urn
}

function formatFragment(frag: OimlUrnFragment): string {
  switch (frag.kind) {
    case 'physical':
      // Unnumbered front matter (contents) formats bare — no trailing dash.
      return frag.number ? `${frag.type}-${frag.number}` : frag.type
    case 'term':
      return `term/${frag.id}`
  }
}

export function urnToCitation(urn: string): string {
  const parsed = parseOimlUrn(urn)
  if (!parsed) return urn

  const doctypeUpper = parsed.doctype.toUpperCase()
  const { docnumber, year, fragment, smartArtifact } = parsed

  const prefix = `OIML ${doctypeUpper} ${docnumber}`
  const dated = year ? `${prefix}:${year}` : prefix

  // SMART artifacts have no physical citation
  if (smartArtifact) {
    return `${dated} [SMART ${smartArtifact.artifactType}/${smartArtifact.path.join('/')}]`
  }

  if (!fragment) return dated

  switch (fragment.kind) {
    case 'physical': {
      const num = fragment.number
      switch (fragment.type) {
        case 'tabl': return `${dated}, Table ${num}`
        case 'fig': return `${dated}, Figure ${num}`
        case 'anx': return `${dated}, Annex ${num}`
        case 'sec': return `${dated}, Section ${num}`
        case 'note': return `${dated}, Note ${num}`
        case 'contents': return `${dated}, Contents`
        case 'clause':
        default:
          return `${dated}, ${num}`
      }
    }
    case 'term':
      return `${dated}, term "${fragment.id.replace(/-/g, ' ')}"`
  }
}

export function urnToShortCitation(urn: string, contextDocnumber?: string): string {
  const parsed = parseOimlUrn(urn)
  if (!parsed) return urn

  const doctypeUpper = parsed.doctype.toUpperCase()
  const { docnumber, fragment, smartArtifact } = parsed

  const prefix = `${doctypeUpper} ${docnumber}`

  if (smartArtifact) {
    return `${smartArtifact.artifactType}/${smartArtifact.path.join('/')}`
  }

  if (!fragment) return prefix

  switch (fragment.kind) {
    case 'physical': {
      const num = fragment.number
      switch (fragment.type) {
        case 'tabl': return `${prefix}, Table ${num}`
        case 'fig': return `${prefix}, Figure ${num}`
        case 'anx': return `${prefix}, Annex ${num}`
        case 'contents': return `${prefix}, Contents`
        default:
          return `${prefix}, ${num}`
      }
    }
    case 'term':
      return fragment.id.replace(/-/g, ' ')
  }
}

export function urnToSmartIdentifier(urn: string): string | undefined {
  const parsed = parseOimlUrn(urn)
  if (!parsed?.smartArtifact) return undefined
  return '/' + [parsed.smartArtifact.artifactType, ...parsed.smartArtifact.path].join('/')
}

export function buildUrn(
  doctype: string,
  docnumber: string,
  year?: string,
  fragment?: OimlUrnFragment,
  smartArtifact?: OimlSmartArtifact,
): string {
  return formatOimlUrn({ doctype, docnumber, year, fragment, smartArtifact })
}

export function buildClauseUrn(doctype: string, docnumber: string, year: string, clause: string): string {
  return buildUrn(doctype, docnumber, year, { kind: 'physical', type: 'clause', number: clause })
}

export function buildTableUrn(doctype: string, docnumber: string, year: string, tableNum: string): string {
  return buildUrn(doctype, docnumber, year, { kind: 'physical', type: 'tabl', number: tableNum })
}

export function buildTermUrn(doctype: string, docnumber: string, year: string, termId: string): string {
  return buildUrn(doctype, docnumber, year, { kind: 'term', id: termId })
}

export function buildReqUrn(doctype: string, docnumber: string, year: string, reqClass: string, reqId: string): string {
  return buildUrn(doctype, docnumber, year, undefined, { artifactType: 'req', path: [reqClass, reqId] })
}

export function buildConfUrn(doctype: string, docnumber: string, year: string, confClass: string, confId: string): string {
  return buildUrn(doctype, docnumber, year, undefined, { artifactType: 'conf', path: [confClass, confId] })
}

export function deriveUrn(baseUrn: string, internalId: string): string | null {
  const parsed = parseOimlUrn(baseUrn)
  if (!parsed) return null

  // internalId formats:
  //   /req/{class}/{id}        → req artifact
  //   /req/{class}             → reqclass artifact
  //   /conf/{class}/{id}       → conf artifact
  //   /conf/{class}            → confclass artifact
  //   /trd/{id}                → trd artifact
  //   /trf/{id}                → trf artifact
  const match = internalId.match(/^\/(\w+)\/(.+)$/)
  if (!match) return null

  const [, prefix, rest] = match
  const parts = rest.split('/')

  switch (prefix) {
    case 'req':
      return buildUrn(parsed.doctype, parsed.docnumber, parsed.year,
        undefined, { artifactType: parts.length > 1 ? 'req' : 'reqclass', path: parts })
    case 'conf':
      return buildUrn(parsed.doctype, parsed.docnumber, parsed.year,
        undefined, { artifactType: parts.length > 1 ? 'conf' : 'confclass', path: parts })
    case 'trd':
      return buildUrn(parsed.doctype, parsed.docnumber, parsed.year,
        undefined, { artifactType: 'trd', path: parts })
    case 'trf':
      return buildUrn(parsed.doctype, parsed.docnumber, parsed.year,
        undefined, { artifactType: 'trf', path: parts })
    default:
      return null
  }
}

export function doctypeLabel(doctype: string): string {
  return DOCTYPE_LABELS[doctype] || doctype
}
