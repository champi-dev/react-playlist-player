"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testCond = exports.objectHasProps = void 0;

const objectHasProps = obj => {
  const shouldEval = !!obj && typeof obj === 'object';

  if (shouldEval) {
    return Object.keys(obj).length > 0;
  }

  return false;
};

exports.objectHasProps = objectHasProps;

const testCond = (testObj, property, evaluation) => {
  return objectHasProps(testObj) ? testObj[property] : evaluation;
};

exports.testCond = testCond;