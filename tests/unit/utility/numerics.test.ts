import { mod, inRange } from '../../../src/utility/numerics';

describe('Modulo', () => {
    type TestObject = { dividend: number, divisor: number, expected: number };

    let cases: TestObject[] = [
        { dividend: -6, divisor: 3, expected: 0 },
        { dividend: -5, divisor: 3, expected: 1 },
        { dividend: -4, divisor: 3, expected: 2 },
        { dividend: -3, divisor: 3, expected: 0 },
        { dividend: -2, divisor: 3, expected: 1 },
        { dividend: -1, divisor: 3, expected: 2 },
        { dividend: 0, divisor: 3, expected: 0 },
        { dividend: 1, divisor: 3, expected: 1 },
        { dividend: 2, divisor: 3, expected: 2 },
        { dividend: 3, divisor: 3, expected: 0 },
        { dividend: 4, divisor: 3, expected: 1 },
        { dividend: 5, divisor: 3, expected: 2 },
    ]

    cases.forEach(testCase => {
        let dividend = testCase.dividend, divisor = testCase.divisor, expected = testCase.expected;
        it(`should be ${expected} when the dividend is ${dividend} and the divisor is ${divisor}`, () => {
            let actual = mod(dividend, divisor);
            expect(actual).toBeCloseTo(expected);
        });
    });
});

describe('In Range', () => {
    type TestObject = { target: number, lower: number, upper: number, expected: boolean };

    let cases: TestObject[] = [
        { target: -1, lower: 0, upper: 2, expected: false },
        { target: 0, lower: 0, upper: 2, expected: true },
        { target: 1, lower: 0, upper: 2, expected: true },
        { target: 2, lower: 0, upper: 2, expected: true },
        { target: 3, lower: 0, upper: 2, expected: false },
        { target: 1, lower: 2, upper: 1, expected: false },
    ]

    cases.forEach(testCase => {
        let target = testCase.target, lower = testCase.lower, upper = testCase.upper, expected = testCase.expected;
        it(`should be ${expected} when the target is ${target} and the range is [${lower}, ${upper}]`, () => {
            let actual = inRange(target, lower, upper);
            expect(actual).toBe(expected);
        });
    });
});
