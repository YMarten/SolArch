const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const path = require('node:path')

// Exercise the component's async creation boundary with real transpiled code and controlled service responses.
function setup(kind, existing = [], fails = false) {
  const state = []; let cursor = 0; const posts = []; const selected = []; const added = []
  const jsx = (type, props) => ({ type, props })
  const service = { getAll: async () => existing, create: async data => {
    posts.push(data); if (fails) throw new Error('Fallo de red')
    return { id: 'persisted-id', ...data }
  } }
  const runtime = { exports: {}, require: name => {
    if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'Fragment' }
    if (name === 'react') return { useState: initial => { const i = cursor++; if (!(i in state)) state[i] = initial; return [state[i], v => { state[i] = v }] } }
    if (name === '@mantine/core') return { MultiSelect: 'multi', Select: 'single', Text: 'text' }
    if (name === '@mantine/notifications') return { notifications: { show() {} } }
    if (name === './CatalogModal') return { CatalogModal: 'modal' }
    return { domainsService: service, areasService: service, capabilitiesService: service, technologiesService: service }
  } }
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../components/catalog/InlineCatalogField.tsx'), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS } }).outputText
  vm.runInNewContext(code, runtime)
  const props = { kind, label: kind, entries: [], multiple: true, value: ['old-id'], onChange: ids => selected.push([...ids]), onCreated: row => { added.push(row); props.entries.push(row) } }
  const render = () => { cursor = 0; return runtime.exports.InlineCatalogField(props).props.children }
  return { render, posts, selected, added }
}
for (const kind of ['domains','areas','technologies','capabilities']) test(`create ${kind}: persisted ID is added to options and selected without losing earlier selection`, async () => {
  const h = setup(kind)
  h.render()[0].props.onSearchChange(' Nuevo ')
  let [select] = h.render()
  const action = select.props.data.at(-1)
  select.props.onChange(['old-id', action.value])
  assert.equal(h.selected.length, 0)
  let [,modal] = h.render()
  assert.equal(modal.props.initialValues.name, 'Nuevo')
  await modal.props.onSubmit({ name: ' Nuevo ', description: 'Descripción', category: 'DATABASE', domainId: 'domain-id', level: '1', parentId: '' })
  assert.equal(h.posts.length, 1)
  assert.equal(h.posts[0].name, 'Nuevo')
  assert.deepEqual(h.selected[0], ['old-id','persisted-id'])
  assert(h.render()[0].props.data.some(o => o.value === 'persisted-id'))
  assert.equal(h.render()[1].props.opened, false)
})
test('existing record fetched from catalog is reused without POST', async () => {
  const h = setup('domains', [{id:'existing-id',name:'NUEVO'}])
  await h.render()[1].props.onSubmit({name:'Nuevo',description:''})
  assert.equal(h.posts.length,0); assert.deepEqual(h.selected[0],['old-id','existing-id'])
})
test('failed POST preserves modal and selection and prevents form reset', async () => {
  const h=setup('domains',[],true)
  h.render()[0].props.onChange(['__create_catalog_entry__'])
  const result=await h.render()[1].props.onSubmit({name:'Nuevo',description:'Conservar'})
  assert.equal(result,false);assert.equal(h.added.length,0);assert.equal(h.selected.length,0);assert.equal(h.render()[1].props.opened,true)
})

