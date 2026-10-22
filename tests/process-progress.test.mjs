import assert from "node:assert/strict";
import test from "node:test";
import { getProcessProgress } from "../src/hooks/processProgress.js";

const bounds = [{ top: 100, bottom: 300 }, { top: 300, bottom: 900 }, { top: 900, bottom: 1150 }];

test("the current process step follows actual unequal step heights", () => {
  assert.deepEqual(getProcessProgress(bounds, 200), { activeIndex: 0, progressByStep: [0.5, 0, 0] });
  assert.deepEqual(getProcessProgress(bounds, 600), { activeIndex: 1, progressByStep: [1, 0.5, 0] });
  assert.equal(getProcessProgress(bounds, 900).activeIndex, 2);
});

test("process progress clamps at both ends and reverses on upward scroll", () => {
  assert.deepEqual(getProcessProgress(bounds, -100), { activeIndex: 0, progressByStep: [0, 0, 0] });
  assert.deepEqual(getProcessProgress(bounds, 2000), { activeIndex: 2, progressByStep: [1, 1, 1] });
  assert.equal(getProcessProgress(bounds, 950).activeIndex, 2);
  assert.equal(getProcessProgress(bounds, 350).activeIndex, 1);
  assert.equal(getProcessProgress(bounds, 150).activeIndex, 0);
});

test("empty or zero-height process lists do not produce invalid progress", () => {
  assert.deepEqual(getProcessProgress([], 200), { activeIndex: 0, progressByStep: [] });
  assert.deepEqual(getProcessProgress([{ top: 100, bottom: 100 }], 100), { activeIndex: 0, progressByStep: [0] });
});
