import { vec2, Vector2 } from '../../src/vector2'

describe('Constructor', () => {
    it('should default all proportions to 0', () => {
        let v = new Vector2();

        expect(v.x).toBe(0);
        expect(v.y).toBe(0);
    });

    it('should store proportions correctly', () => {
        let x = 1;
        let y = 2;
        let v = new Vector2(x, y);

        expect(v.x).toBe(x);
        expect(v.y).toBe(y);
    });
});

describe('Shorthand Constructor', () => {
    it('should default all proportions to 0', () => {
        let v = vec2();

        expect(v.x).toBe(0);
        expect(v.y).toBe(0);
    });

    it('should store proportions correctly', () => {
        let x = 1;
        let y = 2;
        let v = vec2(x, y);

        expect(v.x).toBe(x);
        expect(v.y).toBe(y);
    });
});

describe('Copy', () => {
    it('should return a vector with the same dimension proportions', () => {
        let u = vec2(1, 1);
        let v = u.copy();

        expect(u.x).toBe(v.x);
        expect(u.y).toBe(v.y);
    });

    it('should return a distinctly different vector instance', () => {
        let u = vec2(1, 1);
        let v = u.copy();

        u.x = 2, u.y = 2;

        expect(u.x).not.toBe(v.x);
        expect(u.y).not.toBe(v.y);
    });
});

describe('Unit', () => {
    type TestObject = { angle: number, unit: Vector2 };

    let cases: TestObject[] = [
        { angle: - Math.PI / 6, unit: vec2((3 ** 0.5) / 2, -1 / 2) },
        { angle: -5 * Math.PI / 4, unit: vec2(-1 / (2 ** 0.5), 1 / (2 ** 0.5)) },
        { angle: 0, unit: vec2(1, 0) },
        { angle: Math.PI / 6, unit: vec2((3 ** 0.5) / 2, 1 / 2) },
        { angle: 2 * Math.PI / 3, unit: vec2(-1 / 2, (3 ** 0.5) / 2) },
        { angle: 5 * Math.PI / 4, unit: vec2(-1 / (2 ** 0.5), -1 / (2 ** 0.5)) },
        { angle: 5 * Math.PI / 3, unit: vec2(1 / 2, -(3 ** 0.5) / 2) },
        { angle: 2 * Math.PI, unit: vec2(1, 0) },
        { angle: 13 * Math.PI / 6, unit: vec2((3 ** 0.5) / 2, 1 / 2) },
        { angle: 13 * Math.PI / 4, unit: vec2(-1 / (2 ** 0.5), -1 / (2 ** 0.5)) },
    ];

    cases.forEach(testCase => {
        let angle = testCase.angle, unit = testCase.unit.copy();
        it(`should be ${unit} when angle is ${(angle < 0 ? "" : "+") + angle.toFixed(3)}`, () => {
            let v = Vector2.unit(angle);
            expect(v.x).toBeCloseTo(unit.x);
            expect(v.y).toBeCloseTo(unit.y);
        });
    });
});

describe('Magnitude', () => {
    type TestObject = { vector: Vector2, magnitude: number };

    let cases: TestObject[] = [
        { vector: vec2(3, 4), magnitude: 5 },
        { vector: vec2(-5, 12), magnitude: 13 },
        { vector: vec2(8, -15), magnitude: 17 },
        { vector: vec2(-7, -24), magnitude: 25 }
    ];

    cases.forEach(testCase => {
        let vector = testCase.vector.copy(), magnitude = testCase.magnitude;
        it(`should be ${magnitude} when the vector is ${vector}`, () => {
            expect(vector.magnitude()).toBe(magnitude);
        });
    });
});

describe('Angle', () => {
    type TestObject = { vector: Vector2, angle: number };

    let cases: TestObject[] = [
        { vector: vec2((3 ** 0.5) / 2, 1 / 2), angle: Math.PI / 6 },
        { vector: vec2(-1 / 2, (3 ** 0.5) / 2), angle: 2 * Math.PI / 3 },
        { vector: vec2(-1 / (2 ** 0.5), -1 / (2 ** 0.5)), angle: 5 * Math.PI / 4 },
        { vector: vec2(0, -1), angle: 3 * Math.PI / 2 }
    ];

    cases.forEach(testCase => {
        let vector = testCase.vector.copy(), angle = testCase.angle;
        it(`should be ${angle.toFixed(3)} when the vector is ${vector}`, () => {
            expect(vector.angle()).toBeCloseTo(angle);
        });
    });
});

describe('Dot Product', () => {
    type TestObject = { vectorA: Vector2, vectorB: Vector2, product: number };

    let cases: TestObject[] = [
        { vectorA: vec2(1, 2), vectorB: vec2(3, 1), product: 5 },
        { vectorA: vec2(-1, 2), vectorB: vec2(3, 1), product: -1 },
        { vectorA: vec2(1, 2), vectorB: vec2(3, -1), product: 1 },
        { vectorA: vec2(-1, 2), vectorB: vec2(3, -1), product: -5 },
        { vectorA: vec2(-1, -2), vectorB: vec2(-3, -1), product: 5 }
    ];

    cases.forEach(testCase => {
        let vectorA = testCase.vectorA.copy(), vectorB = testCase.vectorB.copy(), product = testCase.product;
        it(`should be ${product} when the vector are ${vectorA} and ${vectorB}`, () => {
            expect(vectorA.dot(vectorB)).toBe(product);
        });
    });
});


describe('Cross Product', () => {
    type TestObject = { vectorA: Vector2, vectorB: Vector2, product: number };

    let cases: TestObject[] = [
        { vectorA: vec2(1, 2), vectorB: vec2(3, 1), product: -5 },
        { vectorA: vec2(-1, 2), vectorB: vec2(3, 1), product: -7 },
        { vectorA: vec2(1, -2), vectorB: vec2(3, 1), product: 7 },
        { vectorA: vec2(-1, 2), vectorB: vec2(-3, 1), product: 5 },
        { vectorA: vec2(-1, -2), vectorB: vec2(-3, -1), product: -5 }
    ];

    cases.forEach(testCase => {
        let vectorA = testCase.vectorA.copy(), vectorB = testCase.vectorB.copy(), product = testCase.product;
        it(`should be ${product} when the vector are ${vectorA} and ${vectorB}`, () => {
            expect(vectorA.cross(vectorB)).toBe(product);
        });
    });
});

describe('Angle Between', () => {
    type TestObject = { start: Vector2, end: Vector2, angle: number };

    let cases: TestObject[] = [
        { start: vec2((3 ** 0.5) / 2, 1 / 2), end: vec2(-(3 ** 0.5) / 2, 1 / 2), angle: 2 * Math.PI / 3 },
        { start: vec2(-(3 ** 0.5) / 2, 1 / 2), end: vec2((3 ** 0.5) / 2, 1 / 2), angle: 4 * Math.PI / 3 },
        { start: vec2(1 / (2 ** 0.5), 1 / (2 ** 0.5)), end: vec2(-1 / (2 ** 0.5), -1 / (2 ** 0.5)), angle: Math.PI },
        { start: vec2(-1 / (2 ** 0.5), -1 / (2 ** 0.5)), end: vec2(1 / (2 ** 0.5), 1 / (2 ** 0.5)), angle: Math.PI },
    ];

    cases.forEach(testCase => {
        let start = testCase.start.copy(), end = testCase.end.copy(), angle = testCase.angle;
        it(`should be ${angle.toFixed(3)} when the start angle is ${start} and the end angle is ${end}`, () => {
            expect(start.angleBetween(end)).toBeCloseTo(angle);
        });
    });
});

describe('Add', () => {
    type TestObject = { vectorA: Vector2, vectorB: Vector2, sum: Vector2 };

    let cases: TestObject[] = [
        { vectorA: vec2(0, 0), vectorB: vec2(0, 0), sum: vec2(0, 0) },
        { vectorA: vec2(0, 0), vectorB: vec2(0, 1), sum: vec2(0, 1) },
        { vectorA: vec2(0, 0), vectorB: vec2(1, 0), sum: vec2(1, 0) },
        { vectorA: vec2(-2, 3), vectorB: vec2(0, 0), sum: vec2(-2, 3) },
        { vectorA: vec2(3, 4), vectorB: vec2(-2, -3), sum: vec2(1, 1) },
    ];

    cases.forEach(testCase => {
        let vectorA = testCase.vectorA.copy(), vectorB = testCase.vectorB.copy(), sum = testCase.sum;
        it(`should be ${sum} when the vectors are ${vectorA} and ${vectorB} (instanced)`, () => {
            let u = vectorA.add(vectorB);
            expect(u.x).toBe(sum.x);
            expect(u.y).toBe(sum.y);
        });
    });

    cases.forEach(testCase => {
        let vectorA = testCase.vectorA.copy(), vectorB = testCase.vectorB.copy(), sum = testCase.sum;
        it(`should be ${sum} when the vectors are ${vectorA} and ${vectorB} (static)`, () => {
            let u = Vector2.add(vectorA, vectorB);
            expect(u.x).toBe(sum.x);
            expect(u.y).toBe(sum.y);
        });
    });

    it('should return the summed instance when called on an object', () => {
        let u = cases[4].vectorA.copy();
        let v = cases[4].vectorB.copy();

        let w = u.add(v);

        expect(u.x).toBe(w.x);
        expect(u.y).toBe(w.y);
    });

    it('should not mutate either vector when called statically', () => {
        let u = cases[4].vectorA.copy();
        let v = cases[4].vectorB.copy();

        let w = Vector2.add(u, v);

        expect(u.x).not.toBe(w.x);
        expect(u.y).not.toBe(w.y);
        expect(v.x).not.toBe(w.x);
        expect(v.y).not.toBe(w.y);
    });
});

describe('Subtract', () => {
    type TestObject = { vectorA: Vector2, vectorB: Vector2, difference: Vector2 };

    let cases: TestObject[] = [
        { vectorA: vec2(0, 0), vectorB: vec2(0, 1), difference: vec2(0, -1) },
        { vectorA: vec2(0, 0), vectorB: vec2(1, 0), difference: vec2(-1, 0) },
        { vectorA: vec2(-2, 3), vectorB: vec2(0, 0), difference: vec2(-2, 3) },
        { vectorA: vec2(3, 4), vectorB: vec2(-2, -3), difference: vec2(5, 7) },
    ];

    cases.forEach(testCase => {
        let vectorA = testCase.vectorA.copy(), vectorB = testCase.vectorB.copy(), difference = testCase.difference;
        it(`should be ${difference} when the vectors are ${vectorA} and ${vectorB} (instance)`, () => {
            let u = vectorA.subtract(vectorB);
            expect(u.x).toBe(difference.x);
            expect(u.y).toBe(difference.y);
        });
    });

    cases.forEach(testCase => {
        let vectorA = testCase.vectorA.copy(), vectorB = testCase.vectorB.copy(), difference = testCase.difference;
        it(`should be ${difference} when the vectors are ${vectorA} and ${vectorB} (static)`, () => {
            let u = Vector2.subtract(vectorA, vectorB);
            expect(u.x).toBe(difference.x);
            expect(u.y).toBe(difference.y);
        });
    });

    it('should return the subtracted instance when called on an object', () => {
        let u = cases[3].vectorA.copy();
        let v = cases[3].vectorB.copy();

        let w = u.subtract(v);

        expect(u.x).toBe(w.x);
        expect(u.y).toBe(w.y);
    });

    it('should not mutate either vector when called statically', () => {
        let u = cases[3].vectorA.copy();
        let v = cases[3].vectorB.copy();

        let w = Vector2.subtract(u, v);

        expect(u.x).not.toBe(w.x);
        expect(u.y).not.toBe(w.y);
        expect(v.x).not.toBe(w.x);
        expect(v.y).not.toBe(w.y);
    });
});

describe('Scale', () => {
    type TestObject = { vector: Vector2, factor: number, scaled: Vector2 };

    let cases: TestObject[] = [
        { vector: vec2(1, 2), factor: 2, scaled: vec2(2, 4) },
        { vector: vec2(1, 2), factor: 0.5, scaled: vec2(0.5, 1) },
        { vector: vec2(1, 2), factor: 0, scaled: vec2(0, 0) },
        { vector: vec2(0, 0), factor: 1, scaled: vec2(0, 0) },
        { vector: vec2(1, 0), factor: 2, scaled: vec2(2, 0) },
        { vector: vec2(0, 1), factor: 2, scaled: vec2(0, 2) },
    ];

    cases.forEach(testCase => {
        let scaled = testCase.scaled.copy(), vector = testCase.vector.copy(), factor = testCase.factor;
        it(`should be ${scaled} when the vector is ${vector} and the scale is ${factor} (instance)`, () => {
            vector.scale(factor);
            expect(vector.x).toBe(scaled.x);
            expect(vector.y).toBe(scaled.y);
        });
    });

    cases.forEach(testCase => {
        let scaled = testCase.scaled.copy(), vector = testCase.vector.copy(), factor = testCase.factor;
        it(`should be ${scaled} when the vector is ${vector} and the scale is ${factor} (static)`, () => {
            let u = Vector2.scale(vector, factor);
            expect(u.x).toBe(scaled.x);
            expect(u.y).toBe(scaled.y);
        });
    });

    it('should return the scaled instance when called on an object', () => {
        let u = cases[0].vector.copy();
        let f = cases[0].factor;

        let v = u.scale(f);

        expect(u.x).toBe(v.x);
        expect(u.y).toBe(v.y);
    });

    it('should not mutate the vector when called statically', () => {
        let u = cases[0].vector.copy();
        let f = cases[0].factor;

        let v = Vector2.scale(u, f);

        expect(u.x).not.toBe(v.x);
        expect(u.y).not.toBe(v.y);
    });
});

describe('Normalize', () => {
    type TestObject = { vector: Vector2, normalized: Vector2 };

    let cases: TestObject[] = [
        { vector: vec2(3, 4), normalized: vec2(3 / 5, 4 / 5) },
        { vector: vec2(-3, 4), normalized: vec2(-3 / 5, 4 / 5) },
        { vector: vec2(3, -4), normalized: vec2(3 / 5, -4 / 5) },
        { vector: vec2(-3, -4), normalized: vec2(-3 / 5, -4 / 5) },
        { vector: vec2(0, 1), normalized: vec2(0, 1) },
        { vector: vec2(1, 0), normalized: vec2(1, 0) },
        { vector: vec2(0, 0), normalized: vec2(0, 0) },
    ];

    cases.forEach(testCase => {
        let vector = testCase.vector.copy(), normalized = testCase.normalized.copy();
        it(`should be ${normalized} when the vector is ${vector} (instance)`, () => {
            vector.normalize();
            expect(vector.x).toBeCloseTo(normalized.x);
            expect(vector.y).toBeCloseTo(normalized.y);
        });
    });

    cases.forEach(testCase => {
        let vector = testCase.vector.copy(), normalized = testCase.normalized.copy();
        it(`should be ${normalized} when the vector is ${vector} (static)`, () => {
            let u = Vector2.normalize(vector);
            expect(u.x).toBeCloseTo(normalized.x);
            expect(u.y).toBeCloseTo(normalized.y);
        });
    });

    it('should return the normalized instance when called on an object', () => {
        let u = cases[0].vector.copy();

        let v = u.normalize();

        expect(u.x).toBe(v.x);
        expect(u.y).toBe(v.y);
    });

    it('should not mutate the vector when called statically', () => {
        let u = cases[0].vector.copy();

        let v = Vector2.normalize(u);

        expect(u.x).not.toBe(v.x);
        expect(u.y).not.toBe(v.y);
    });
});

describe('Rotate', () => {
    type TestObject = { vector: Vector2, angle: number, rotated: Vector2 };

    let cases: TestObject[] = [
        { vector: vec2(1, 0), angle: Math.PI / 3, rotated: vec2(1 / 2, (3 ** 0.5) / 2) },
        { vector: vec2(1 / (2 ** 0.5), 1 / (2 ** 0.5)), angle: Math.PI / 2, rotated: vec2(-(2 ** 0.5) / 2, (2 ** 0.5) / 2) },
        { vector: vec2(0, 1), angle: 11 * Math.PI / 6, rotated: vec2(1 / 2, (3 ** 0.5) / 2) },
        { vector: vec2(1, 0), angle: 7 * Math.PI / 3, rotated: vec2(1 / 2, (3 ** 0.5) / 2) },
        { vector: vec2(1 / (2 ** 0.5), 1 / (2 ** 0.5)), angle: 5 * Math.PI / 2, rotated: vec2(-(2 ** 0.5) / 2, (2 ** 0.5) / 2) },
        { vector: vec2(0, 1), angle: 23 * Math.PI / 6, rotated: vec2(1 / 2, (3 ** 0.5) / 2) },
        { vector: vec2(1, 0), angle: -Math.PI / 3, rotated: vec2(1 / 2, -(3 ** 0.5) / 2) },
        { vector: vec2(1 / (2 ** 0.5), 1 / (2 ** 0.5)), angle: -Math.PI / 2, rotated: vec2(1 / (2 ** 0.5), -1 / (2 ** 0.5)) },
        { vector: vec2(0, 1), angle: -11 * Math.PI / 6, rotated: vec2(-1 / 2, (3 ** 0.5) / 2) },
    ];

    cases.forEach(testCase => {
        let vector = testCase.vector.copy(), angle = testCase.angle, rotated = testCase.rotated.copy();
        it(`should be ${rotated} when the vector is ${vector} and the angle is ${angle} (instance)`, () => {
            vector.rotate(angle);
            expect(vector.x).toBeCloseTo(rotated.x);
            expect(vector.y).toBeCloseTo(rotated.y);
        });
    });

    cases.forEach(testCase => {
        let vector = testCase.vector.copy(), angle = testCase.angle, rotated = testCase.rotated.copy();
        it(`should be ${rotated} when the vector is ${vector} and the angle is ${angle} (static)`, () => {
            let u = Vector2.rotate(vector, angle);
            expect(u.x).toBeCloseTo(rotated.x);
            expect(u.y).toBeCloseTo(rotated.y);
        });
    });

    it('should return the rotated instance when called on an object', () => {
        let u = cases[0].vector.copy();
        let a = cases[0].angle;

        let v = u.rotate(a);

        expect(u.x).toBe(v.x);
        expect(u.y).toBe(v.y);
    });

    it('should not mutate the vector when called statically', () => {
        let u = cases[0].vector.copy();
        let a = cases[0].angle;

        let v = Vector2.rotate(u, a);

        expect(u.x).not.toBe(v.x);
        expect(u.y).not.toBe(v.y);
    });
});

describe('Reflect', () => {
    type TestObject = { vector: Vector2, axis: Vector2, reflected: Vector2 };

    let cases: TestObject[] = [
        { vector: vec2(1, 0), axis: vec2(0, 1), reflected: vec2(-1, 0) },
        { vector: vec2(1, 0), axis: vec2(0, -1), reflected: vec2(-1, 0) },
        { vector: vec2(0, 1), axis: vec2(1, 0), reflected: vec2(0, -1) },
        { vector: vec2(0, 1), axis: vec2(-1, 0), reflected: vec2(0, -1) },
        { vector: vec2(2, 1), axis: vec2(1, 1), reflected: vec2(1, 2) },
        { vector: vec2(2, 1), axis: vec2(-1, 1), reflected: vec2(-1, -2) },
        { vector: vec2(0, 0), axis: vec2(1, 1), reflected: vec2(0, 0) },
    ];

    cases.forEach(testCase => {
        let vector = testCase.vector.copy(), axis = testCase.axis, reflected = testCase.reflected.copy();
        it(`should be ${reflected} when the vector is ${vector} and the angle is ${axis} (instance)`, () => {
            vector.reflect(axis);
            expect(vector.x).toBeCloseTo(reflected.x);
            expect(vector.y).toBeCloseTo(reflected.y);
        });
    });

    cases.forEach(testCase => {
        let vector = testCase.vector.copy(), axis = testCase.axis, reflected = testCase.reflected.copy();
        it(`should be ${reflected} when the vector is ${vector} and the angle is ${axis} (static)`, () => {
            let u = Vector2.reflect(vector, axis);
            expect(u.x).toBeCloseTo(reflected.x);
            expect(u.y).toBeCloseTo(reflected.y);
        });
    });

    it('should return the reflected instance', () => {
        let u = cases[4].vector.copy();
        let a = cases[4].axis.copy();
        let v = u.reflect(a);

        expect(u.x).toBeCloseTo(v.x);
        expect(u.y).toBeCloseTo(v.y);
    });

    it('should not mutate the vector when called statically', () => {
        let u = cases[4].vector.copy();
        let a = cases[4].axis.copy();

        let v = Vector2.reflect(u, a);

        expect(u.x).not.toBe(v.x);
        expect(u.y).not.toBe(v.y);
    });
});