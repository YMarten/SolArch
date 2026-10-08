const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const runtime = { exports: {} }
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname, '../lib/ecosystem.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, runtime)
const { ecosystemView, connectedSets } = runtime.exports
const solutions = ['a', 'b', 'middle', 'isolated', 'inactive'].map(id => ({ id, role: id === 'middle' ? 'INTEGRATION' : 'SATELLITE' }))
const connections = [
  { id: '1', fromId: 'a', toId: 'b', intermediarySolutionId: 'middle', type: 'REST', isActive: true },
  { id: '2', fromId: 'b', toId: 'inactive', intermediarySolutionId: null, type: 'SOAP', isActive: false },
]
const ids = list => Array.from(list, s => s.id).sort()
test('inactive connections and intermediary participation count as registered', () => {
  const view = ecosystemView(solutions, connections, undefined, null, null, 'all')
  assert.deepEqual(ids(view.isolated), ['isolated'])
  assert.equal(view.nodes.length, 4)
})
test('active and protocol filters do not falsely classify nodes as isolated', () => {
  const view = ecosystemView(solutions, connections, undefined, null, 'REST', 'active')
  assert.deepEqual(ids(view.isolated), ['isolated'])
  assert.deepEqual(ids(view.hidden), ['inactive'])
})
test('group and role filters preserve external intermediaries', () => {
  const view = ecosystemView(solutions, connections, ['a', 'b'], 'SATELLITE', null, 'all')
  assert.deepEqual(ids(view.nodes), ['a', 'b', 'middle'])
  assert.equal(view.isolated.length, 0)
})
test('connections outside scope are hidden, not unregistered', () => {
  const view = ecosystemView(solutions, connections, ['a', 'isolated'], null, null, 'all')
  assert.deepEqual(ids(view.hidden), ['a'])
  assert.deepEqual(ids(view.isolated), ['isolated'])
  assert.equal(view.nodes.length, 0)
})
test('connected components include intermediary nodes and disconnected sets', () => {
  const groups = connectedSets(solutions.map(s => s.id), connections)
  assert.equal(groups.length, 2)
  assert.deepEqual(Array.from(groups[0]).sort(), ['a', 'b', 'inactive', 'middle'])
  assert.deepEqual(Array.from(groups[1]), ['isolated'])
})
