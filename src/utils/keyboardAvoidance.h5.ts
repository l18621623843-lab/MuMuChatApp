export function computeEffectiveKeyboardHeight(params: {
  rawHeight: number
  baseWindowHeight: number
  currentWindowHeight: number
}) {
  const delta = Math.max(params.baseWindowHeight - params.currentWindowHeight, 0)
  return Math.max(params.rawHeight - delta, 0)
}

export function updateKeyboardAvoidanceState(params: {
  prevBaseWindowHeight: number
  rawKeyboardHeight: number
  currentWindowHeight: number
  safeAreaHeight?: number
}) {
  const safeAreaHeight = params.safeAreaHeight || 0
  const currentWindowHeight = params.currentWindowHeight || 0
  const baseWindowHeight = Math.max(params.prevBaseWindowHeight || 0, safeAreaHeight, currentWindowHeight)
  const effectiveKeyboardHeight = params.rawKeyboardHeight
    ? computeEffectiveKeyboardHeight({
        rawHeight: params.rawKeyboardHeight,
        baseWindowHeight,
        currentWindowHeight,
      })
    : 0
  return { baseWindowHeight, effectiveKeyboardHeight }
}
