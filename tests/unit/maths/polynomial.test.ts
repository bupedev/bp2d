import { Polynomial } from "../../../src/maths/polynomial";

describe('Constructor', () => {
    it('Should store coefficients correctly', () => {
        const coefficients = [2, 4, 3, 1];
        const polynomial = new Polynomial(coefficients);
        
        const coefficientsIdentical = primitiveArraysEquals(coefficients, polynomial.coefficients);
        expect(coefficientsIdentical).toBeTruthy();
    });

    it('Should not store reference to argument array', () => {
        const coefficients = [2, 4, 3, 1];
        const polynomial = new Polynomial(coefficients);

        coefficients[0] = 5;

        const coefficientsIdentical = primitiveArraysEquals(coefficients, polynomial.coefficients);
        expect(coefficientsIdentical).toBeFalsy();
    });
});

describe('String Conversion', () => {
    var testCases = [
        {coefficients: [2, 4, 5, 1], expected: "x^3 + 5x^2 + 4x + 2"},
        {coefficients: [-3, 0, 1, -2], expected: "-2x^3 + x^2 - 3"}
    ];

    testCases.forEach(testCase => {
        it(`Should format polynomial with coefficients ${testCase.coefficients} correctly (${testCase.expected}).`, () => {
            const coefficients = testCase.coefficients;
            const polynomial = new Polynomial(coefficients);
            const expected = testCase.expected;
            const actual = polynomial.toString();

            expect(actual).toBe(expected);
        });
    });
});

describe('String Conversion', () => {
    var testCases = [
        {coefficients: [2, 4, 5, 1], value: 0, expected: 2},
        {coefficients: [2, 4, 5, 1], value: 1, expected: 12},
        {coefficients: [2, 4, 5, 1], value: 2, expected: 38},
        {coefficients: [-3, 0, 1, -2], value: 0, expected: -3},
        {coefficients: [-3, 0, 1, -2], value: 1, expected: -4},
        {coefficients: [-3, 0, 1, -2], value: 2, expected: -15},
    ];

    testCases.forEach(testCase => {
        it(`Should evaluate a polynomial with coefficients ${testCase.coefficients} correctly at ${testCase.value} (${testCase.expected}).`, () => {
            const coefficients = testCase.coefficients;
            const polynomial = new Polynomial(coefficients);
            const expected = testCase.expected;
            const actual = polynomial.evaluate(testCase.value);
    
            expect(actual).toBe(expected);
        });
    });
});


describe('Derivative', () => {
    var testCases = [
        {coefficients: [2, 4, 5, 1], order: 0, expected: [2, 4, 5, 1]},
        {coefficients: [2, 4, 5, 1], order: 1, expected: [4, 10, 3]},
        {coefficients: [2, 4, 5, 1], order: 2, expected: [10, 6]},
        {coefficients: [-3, 0, 1, -2], order: 0, expected: [-3, 0, 1, -2]},
        {coefficients: [-3, 0, 1, -2], order: 1, expected: [0, 2, -6]},
        {coefficients: [-3, 0, 1, -2], order: 2, expected: [2, -12]},
    ];

    testCases.forEach(testCase => {
        it(`Should find the derivative of a polynomial with coefficients ${testCase.coefficients} correctly (${testCase.expected}).`, () => {
            const coefficients = testCase.coefficients;
            const polynomial = new Polynomial(coefficients);
            const expected = testCase.expected;
            const actual = polynomial.getDerivative(testCase.order).coefficients;

            expect(actual).toStrictEqual(expected);
        });
    });
});


// describe('Root Finding', () => {
//     var testCases = [
//         {coefficients: [0, 0, 1], guess: 0.5, expected: 0 },
//         {coefficients: [0, 0, 1], guess: -0.5, expected: 0 },
//         {coefficients: [-1, 0, 1], guess: 2, expected: 1 },
//         {coefficients: [-1, 0, 1], guess: -2, expected: -1 },
//     ];

//     testCases.forEach(testCase => {
//         it(`Should find the root of the of a polynomial with coefficients ${testCase.coefficients} closest to ${testCase.guess} correctly (${testCase.expected}).`, () => {
//             const coefficients = testCase.coefficients;
//             const polynomial = new Polynomial(coefficients);
//             const expected = testCase.expected;
//             const actual = polynomial.getRoot(testCase.guess, 1e-6, 10);

//             expect(actual).toBeCloseTo(expected);
//         });
//     });
// });


function primitiveArraysEquals(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }