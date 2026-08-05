// Generates conformance/urn.json from the corpus module (one SSOT).
import { writeFileSync } from 'node:fs'
import { URN_CORPUS } from '../src/urn-corpus-data.js'

writeFileSync(new URL('../conformance/urn.json', import.meta.url), JSON.stringify(URN_CORPUS, null, 2) + '\n')
console.log('conformance/urn.json synced from src/urn-corpus-data.ts')
