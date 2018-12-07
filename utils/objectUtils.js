export const objectHasProps = obj => {
  const shouldEval = !!obj && typeof obj === 'object'
  if (shouldEval) {
    return Object.keys(obj).length > 0
  }
  return false
}

export const testCond = (testObj, property, evaluation) => {
  return objectHasProps(testObj) ? testObj[property] : evaluation
}
