import { Bezier } from "../../../src/geometry/bezier";
import { vtx } from "../../../src/geometry/vertex";

describe('Get Polynomials', () => {
  var testCases = [
    { points: [vtx(1, 2), vtx(10, 5)], xCoeff: [1, 9], yCoeff: [2, 3] },
    { points: [vtx(1, 1), vtx(5, 1), vtx(5, 2), vtx(4, 2)], xCoeff: [1, 12, -12, 3], yCoeff: [1, 0, 3, -2] },
  ];

  testCases.forEach(testCase => {
    it(`Should return polynomials (x = ${testCase.xCoeff} and y = ${testCase.yCoeff}) for bezier points ${testCase.points}`, () => {
      const bezier = new Bezier(testCase.points);
      const [xPoly, yPoly] = bezier.getPolynomials();
  
      const xC = xPoly.coefficients;
      const yC = yPoly.coefficients;
  
      expect(primitiveArraysEquals(xC, testCase.xCoeff)).toBeTruthy();
      expect(primitiveArraysEquals(yC, testCase.yCoeff)).toBeTruthy();
    });
  });
});


function primitiveArraysEquals(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}