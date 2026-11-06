require('./register.cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { addHabitToState, toggleHabitToday, graduateHabitInState } = require('../src/domain/habits.ts');
const { getConsistency, dayInHabitRange, habitEndDate } = require('../src/utils/consistency.ts');
const { lastNDays } = require('../src/utils/dates.ts');
const { decodeState, createSaveQueue } = require('../src/storage/codec.ts');
const now = new Date(2026, 10, 6, 12);
const input = { name: '  Read  ', anchorCue: '  breakfast  ' };
const empty = () => decodeState(null);
const create = () => addHabitToState(empty(), input, 'h', now).state;

test('required name and anchor validated in domain, optional tiny version and trimming', () => {
  for (const invalid of [{ name: ' ', anchorCue: 'cue' }, { name: 'Read', anchorCue: '  ' }]) {
    assert.equal(addHabitToState(empty(), invalid, 'h', now).ok, false);
  }
  const { habit } = addHabitToState(empty(), { ...input, tinyVersion: '  one page  ' }, 'h', now);
  assert.equal(habit.name, 'Read'); assert.equal(habit.anchorCue, 'breakfast');
  assert.equal(habit.tinyVersion, 'one page'); assert.equal(habit.startedOn, '2026-11-06');
  assert.equal(create().habits[0].tinyVersion, null);
});

test('hard cap enforced at state boundary including sequential same-tick submissions', () => {
  let state = empty();
  for (let i = 0; i < 5; i++) state = addHabitToState(state, input, `h${i}`, now).state;
  assert.equal(state.habits.length, 5);
  assert.equal(addHabitToState(state, input, 'sixth', now).ok, false);
  const freed = graduateHabitInState(state, 'h0', undefined, now);
  const result = addHabitToState(freed, input, 'sixth', now);
  assert.equal(result.ok, true); assert.equal(result.state.habits.filter(h => h.status === 'active').length, 5);
  assert.equal(addHabitToState(result.state, input, 'seventh', now).ok, false);
});

test('new habit: inclusive denominator one, off/on updates immediately and unique daily record', () => {
  let state = create();
  assert.deepEqual(getConsistency(state.habits[0], state.completions, now), { percent: 0, completed: 0, tracked: 1 });
  for (let i = 0; i < 101; i++) state = toggleHabitToday(state, 'h', `c${i}`, now);
  assert.equal(state.completions.length, 1); assert.equal(state.completions[0].completed, true);
  assert.equal(getConsistency(state.habits[0], state.completions, now).percent, 100);
  state = toggleHabitToday(state, 'h', 'off', now);
  assert.equal(state.completions.length, 1); assert.equal(state.completions[0].completed, false);
});

test('toggle uses the local day, creates a separate record next day; unknown IDs no-op', () => {
  const first = toggleHabitToday(create(), 'h', 'a', now);
  const next = toggleHabitToday(first, 'h', 'b', new Date(2026, 10, 7, 0, 1));
  assert.deepEqual(next.completions.map(c => c.date), ['2026-11-06', '2026-11-07']);
  assert.equal(toggleHabitToday(next, 'missing', 'c', now), next);
  assert.equal(graduateHabitInState(next, 'missing', '', now), next);
});

test('duplicates count once; pre-creation, future, false and unrelated records excluded', () => {
  let state = create();
  state.completions = ['2026-11-05', '2026-11-06', '2026-11-06', '2026-11-07'].map((date, i) => ({ id: `c${i}`, habitId: 'h', date, completed: true }));
  state.completions.push({ id: 'other', habitId: 'other', date: '2026-11-06', completed: true });
  assert.equal(getConsistency(state.habits[0], state.completions, now).completed, 1);
  state = toggleHabitToday(state, 'h', 'off', now);
  assert.equal(state.completions.filter(c => c.habitId === 'h' && c.date === '2026-11-06').length, 1);
  assert.equal(getConsistency(state.habits[0], state.completions, now).completed, 0);
});

test('graduation stores optional reflection/date, freezes metrics and makes archive immutable', () => {
  const state = toggleHabitToday(create(), 'h', 'c', now);
  const graduation = new Date(2026, 10, 7, 12);
  const graduated = graduateHabitInState(state, 'h', '  It stuck!  ', graduation);
  const habit = graduated.habits[0];
  assert.equal(habit.status, 'graduated'); assert.equal(habit.graduationNote, 'It stuck!');
  assert.equal(habit.graduatedOn, '2026-11-07'); assert.equal(habit.graduatedAt, graduation.toISOString());
  assert.equal(state.habits[0].status, 'active');
  const later = new Date(2027, 0, 1);
  assert.deepEqual(getConsistency(habit, graduated.completions, later), { percent: 50, completed: 1, tracked: 2 });
  assert.equal(toggleHabitToday(graduated, 'h', 'no', later), graduated);
  assert.equal(graduateHabitInState(graduated, 'h', 'changed', later), graduated);
  assert.equal(graduateHabitInState(create(), 'h', '  ', now).habits[0].graduationNote, null);
  assert.equal(graduateHabitInState(create(), 'h', undefined, now).habits[0].graduationNote, null);
});

test('calendar excludes precreation and future; archived window ends at graduation', () => {
  const habit = create().habits[0];
  assert.equal(dayInHabitRange(habit, '2026-11-05', now), false);
  assert.equal(dayInHabitRange(habit, '2026-11-06', now), true);
  assert.equal(dayInHabitRange(habit, '2026-11-07', now), false);
  const archived = graduateHabitInState(create(), 'h', '', now).habits[0];
  const keys = lastNDays(30, habitEndDate(archived, new Date(2027, 0, 1)));
  assert.equal(keys.length, 30); assert.equal(new Set(keys).size, 30);
  assert.equal(keys.at(-1), '2026-11-06'); assert.equal(keys[0], '2026-10-08');
  assert.equal(dayInHabitRange(archived, '2026-11-07', new Date(2027, 0, 1)), false);
});

test('v1 storage roundtrip preserves legacy habits, IDs, completions, notes and onboarding', () => {
  const legacy = create(); delete legacy.habits[0].startedOn;
  legacy.habits[0].anchorCue = ''; // old version allowed a blank cue; do not discard it
  legacy.completions.push({ id: 'original', habitId: 'h', date: '2026-11-06', completed: true });
  legacy.onboardingComplete = true;
  assert.deepEqual(decodeState(JSON.stringify(legacy)), legacy);
  assert.equal(getConsistency(legacy.habits[0], legacy.completions, now).percent, 100);
  const archive = graduateHabitInState(legacy, 'h', 'Legacy note', now);
  delete archive.habits[0].graduatedOn;
  assert.equal(getConsistency(decodeState(JSON.stringify(archive)).habits[0], legacy.completions, new Date(2027, 0, 1)).tracked, 1);
  assert.deepEqual(decodeState('{}'), empty());
});

test('corrupt/unreadable data is rejected, never silently interpreted as empty', () => {
  for (const raw of ['not json', 'null', '[]', '{"habits":42}', '{"completions":[{}]}', '{"habits":[{}]}']) {
    assert.throws(() => decodeState(raw));
  }
});

test('persistence queue serializes writes and can retry after an error', async () => {
  const writes = []; let finish;
  const queue = createSaveQueue(value => new Promise(resolve => { writes.push(value); finish = resolve; }));
  const first = queue(create()); const second = queue({ ...create(), onboardingComplete: true });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(writes.length, 1); finish(); await first;
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(writes.length, 2); finish(); await second;
  assert.equal(decodeState(writes[1]).onboardingComplete, true);
  let failed = true;
  const retryQueue = createSaveQueue(async () => { if (failed) { failed = false; throw Error('quota'); } });
  await assert.rejects(retryQueue(create())); await retryQueue(create());
});

for (const timezone of ['America/Vancouver', 'America/New_York', 'Europe/Berlin', 'Asia/Tokyo', 'UTC']) {
  test(`calendar days, ISO/date-only parsing and local completion in ${timezone}`, () => {
    const code = `require('./tests/register.cjs');
      const assert = require('node:assert/strict');
      const { daysTracked, toDateKey, lastNDays } = require('./src/utils/dates.ts');
      const { addHabitToState, toggleHabitToday } = require('./src/domain/habits.ts');
      const { decodeState } = require('./src/storage/codec.ts');
      for (const [month, day] of [[2,7], [2,28], [9,24], [9,31]]) {
        const start = new Date(2026, month, day, 23, 50);
        const end = new Date(2026, month, day + 3, 0, 10);
        assert.equal(daysTracked(start.toISOString(), end), 4);
        assert.equal(daysTracked(toDateKey(start), end), 4);
        assert.equal(lastNDays(30, end).length, 30);
      }
      const midnight = new Date(2026, 10, 6, 0, 1);
      assert.equal(daysTracked('2026-11-06', midnight), 1);
      const result = addHabitToState(decodeState(null), {name:'Read', anchorCue:'tea'}, 'h', midnight);
      const checked = toggleHabitToday(result.state, 'h', 'c', midnight);
      assert.equal(checked.completions[0].date, '2026-11-06');`;
    const result = spawnSync(process.execPath, ['-e', code], { cwd: process.cwd(), env: { ...process.env, TZ: timezone }, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  });
}
