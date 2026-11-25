// Station time must depend on the destination, not the path taken to it.
// Execute the real tour definitions and patch wrappers without a renderer.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '../..');
const build = fs.readFileSync(path.join(root, 'src/main/40-temple-build.js'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'src/main/62-tours-ui.js'), 'utf8');
const definitions = build.slice(0, build.indexOf('await __Y(86);'));
const patchStart = ui.indexOf('const setTime=k=>');
const patchEnd = ui.indexOf('\n})();', patchStart) + '\n})();'.length;
assert.ok(patchStart >= 0 && patchEnd > patchStart, 'time patch markers exist');
function load(patched, insert = false) {
  const actions = [];
  const quiet = new Proxy({}, { get: () => () => {} });
  const scope = { STORIES: {}, PLZ: 0, TIME: 'morning', AP: () => [], VP: () => [], GP: () => [],
    SND: quiet, TOURFIGS: quiet, SHOW_FEST: false, setTimeout: () => 0,
    ACTS: { tm: { set: (...a) => actions.push(['tm', ...a]) },
      yk: { set: (...a) => actions.push(['yk', ...a]) } } };
  scope.document = { getElementById: id => ({ click() {
    scope.TIME = { tM: 'morning', tN: 'noon', tE: 'evening', tL: 'night' }[id];
  } }) };
  vm.createContext(scope);
  vm.runInContext(definitions, scope);
  if (insert) scope.STORIES.tamid.steps.splice(3, 0, { title: 'Regression insertion before dawn' });
  if (patched) vm.runInContext(ui.slice(patchStart, patchEnd), scope);
  return { scope, actions };
}
const enter = st => { if (st.enter) st.enter(); };
let transitions = 0;
for (const key of ['tamid', 'yk']) {
  const before = load(false), after = load(true);
  const a = before.scope.STORIES[key].steps, b = after.scope.STORIES[key].steps;
  const expected = key === 'tamid'
    ? [...Array(6).fill('night'), ...Array(10).fill('morning')]
    : ['morning', 'night', ...Array(11).fill('morning')];
  a.forEach((st, i) => {
    before.actions.length = after.actions.length = 0;
    enter(st); enter(b[i]);
    assert.equal(after.scope.TIME, expected[i], `${key} sequential station ${i + 1}`);
    assert.deepEqual(after.actions, before.actions, `${key} actor actions ${i + 1}`);
  });
  for (const start of ['morning', 'night', 'noon', 'evening']) {
    for (let from = 0; from < b.length; from++) for (let to = 0; to < b.length; to++) {
      after.scope.TIME = start;
      enter(b[from]); enter(b[to]);
      assert.equal(after.scope.TIME, expected[to], `${key} ${start}: ${from + 1} -> ${to + 1}`);
      transitions++;
    }
  }
  console.log(`${key}: sequential schedule and actor actions unchanged; every direct jump correct`);
}
const inserted = load(true, true);
const stations = inserted.scope.STORIES.tamid.steps;
const dawn = stations.findIndex(st => st.title === 'ברקאי — האיר המזרח');
assert.equal(dawn, 7);
stations.forEach((st, i) => {
  inserted.scope.TIME = i < dawn ? 'morning' : 'night';
  enter(st);
  assert.equal(inserted.scope.TIME, i < dawn ? 'night' : 'morning', `inserted station ${i + 1}`);
});
console.log(`PASS: ${transitions} direct transitions, 29 sequential stations, actor-action parity, insertion-safe dawn boundary`);
