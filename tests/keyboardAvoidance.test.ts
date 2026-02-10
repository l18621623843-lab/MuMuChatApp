import assert from 'node:assert/strict'
import test from 'node:test'
import { computeEffectiveKeyboardHeight, updateKeyboardAvoidanceState } from '../src/utils/keyboardAvoidance.js'

test('computeEffectiveKeyboardHeight no window shrink', () => {
  const h = computeEffectiveKeyboardHeight({
    rawHeight: 300,
    baseWindowHeight: 800,
    currentWindowHeight: 800,
  })
  assert.equal(h, 300)
})

test('computeEffectiveKeyboardHeight with window shrink', () => {
  const h = computeEffectiveKeyboardHeight({
    rawHeight: 300,
    baseWindowHeight: 800,
    currentWindowHeight: 600,
  })
  assert.equal(h, 100)
})

test('computeEffectiveKeyboardHeight clamps to 0', () => {
  const h = computeEffectiveKeyboardHeight({
    rawHeight: 200,
    baseWindowHeight: 800,
    currentWindowHeight: 500,
  })
  assert.equal(h, 0)
})

test('updateKeyboardAvoidanceState keeps baseWindowHeight monotonic', () => {
  const r1 = updateKeyboardAvoidanceState({
    prevBaseWindowHeight: 800,
    rawKeyboardHeight: 0,
    currentWindowHeight: 600,
  })
  assert.equal(r1.baseWindowHeight, 800)
  assert.equal(r1.effectiveKeyboardHeight, 0)
})

test('updateKeyboardAvoidanceState handles keyboard-open on first frame using safeAreaHeight', () => {
  const r = updateKeyboardAvoidanceState({
    prevBaseWindowHeight: 600,
    rawKeyboardHeight: 300,
    currentWindowHeight: 500,
    safeAreaHeight: 800,
  })
  assert.equal(r.baseWindowHeight, 800)
  assert.equal(r.effectiveKeyboardHeight, 0)
})

test('updateKeyboardAvoidanceState does not under-compensate when no window shrink', () => {
  const r = updateKeyboardAvoidanceState({
    prevBaseWindowHeight: 800,
    rawKeyboardHeight: 300,
    currentWindowHeight: 800,
    safeAreaHeight: 800,
  })
  assert.equal(r.baseWindowHeight, 800)
  assert.equal(r.effectiveKeyboardHeight, 300)
})
