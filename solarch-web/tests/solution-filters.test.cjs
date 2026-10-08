const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const runtime = { exports: {} }
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname, '../lib/solution-filters.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, runtime)
const { filterSolutions, emptySolutionFilters } = runtime.exports
const records = [
  { name: 'Alpha', usageStatus: 'IN_USE', criticality: 'HIGH', hasProblems: true },
  { name: 'Beta', usageStatus: 'LIMITED_USE', criticality: 'HIGH', hasProblems: false },
  { name: 'Gamma', usageStatus: 'NOT_IN_USE', criticality: 'LOW', hasProblems: false },
  { name: 'Delta', usageStatus: null, criticality: 'LOW', hasProblems: false },
]
test('multiple values use OR within a field and AND across fields and search', () => {
  const filters = emptySolutionFilters()
  assert.equal(filterSolutions(records, filters).length, 4)
  filters.usageStatus = ['IN_USE', 'LIMITED_USE']
  assert.equal(filterSolutions(records, filters).length, 2)
  filters.hasProblems = ['false']
  assert.equal(filterSolutions(records, filters)[0].name, 'Beta')
  filters.hasProblems = ['true', 'false']
  assert.equal(filterSolutions(records, filters).length, 2)
  filters.search = '  BETA  '
  assert.equal(filterSolutions(records, filters)[0].name, 'Beta')
  filters.criticality = ['LOW']
  assert.equal(filterSolutions(records, filters).length, 0)
  assert.equal(filterSolutions(records, emptySolutionFilters()).length, 4)
})
