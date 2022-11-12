import { vec, Vector, vtx, Vertex } from '../../../src/index';

describe('Constructor', () => {
    it('should default all dimensions to 0', () => {
        let v = new Vertex();

        expect(v.x).toBe(0);
        expect(v.y).toBe(0);
    });

    it('should store coordinates correctly', () => {
        let x = 1;
        let y = 2;
        let v = new Vertex(x, y);

        expect(v.x).toBe(x);
        expect(v.y).toBe(y);
    });
});

describe('Shorthand Constructor', () => {
    it('should default all dimensions to 0', () => {
        let v = vtx();

        expect(v.x).toBe(0);
        expect(v.y).toBe(0);
    });

    it('should store coordinates correctly', () => {
        let x = 1;
        let y = 2;
        let v = vtx(x, y);

        expect(v.x).toBe(x);
        expect(v.y).toBe(y);
    });
});

describe('Copy', () => {
    it('should return a vertex with the same dimension proportions', () => {
        let u = vtx(1, 1);
        let v = u.copy();

        expect(u.x).toBe(v.x);
        expect(u.y).toBe(v.y);
    });

    it('should return a distinctly different vertex instance', () => {
        let u = vtx(1, 1);
        let v = u.copy();

        u.x = 2, u.y = 2;

        expect(u.x).not.toBe(v.x);
        expect(u.y).not.toBe(v.y);
    });
});

describe('Translate', () => {
    type TestObject = { vertex: Vertex, x: number, y: number, translated: Vertex };

    let cases: TestObject[] = [
        { vertex: vtx(0, 0), x: 0, y: 0, translated: vtx(0, 0) },
        { vertex: vtx(0, 0), x: 1, y: 0, translated: vtx(1, 0) },
        { vertex: vtx(0, 0), x: 0, y: 1, translated: vtx(0, 1) },
        { vertex: vtx(1, 2), x: 2, y: 3, translated: vtx(3, 5) },
        { vertex: vtx(1, 2), x: -2, y: 3, translated: vtx(-1, 5) },
        { vertex: vtx(1, 2), x: 2, y: -3, translated: vtx(3, -1) },
        { vertex: vtx(1, 2), x: -2, y: -3, translated: vtx(-1, -1) },
    ];

    let baseCase = cases[3];

    cases.forEach(testCase => {
        let vertex = testCase.vertex.copy(), x = testCase.x, y = testCase.y, translated = testCase.translated.copy();
        it(`should be ${translated} when the vertex is ${vertex} and the x translation is ${x} and y translation is ${y} (instance)`, () => {
            let v = vertex.translate(x, y);
            expect(v.x).toBeCloseTo(translated.x);
            expect(v.y).toBeCloseTo(translated.y);
        });
    });

    cases.forEach(testCase => {
        let vertex = testCase.vertex.copy(), x = testCase.x, y = testCase.y, translated = testCase.translated.copy();
        it(`should be ${translated} when the vertex is ${vertex} and the x translation is ${x} and y translation is ${y} (static)`, () => {
            let v = Vertex.translate(vertex, x, y);
            expect(v.x).toBeCloseTo(translated.x);
            expect(v.y).toBeCloseTo(translated.y);
        });
    });

    it('should return the translated instance when called on an object', () => {
        let u = baseCase.vertex.copy();
        let x = baseCase.x;
        let y = baseCase.y;

        let w = u.translate(x, y);
        expect(u.x).toBe(w.x);
        expect(u.y).toBe(w.y);
    });

    it('should not mutate the vertex when called statically', () => {
        let u = baseCase.vertex.copy();
        let x = baseCase.x;
        let y = baseCase.y;

        let w = Vertex.translate(u, x, y);
        expect(u.x).not.toBe(w.x);
        expect(u.y).not.toBe(w.y);
    });

    it('should default both arguments to 0 (instance)', () => {
        let u = baseCase.vertex.copy();
        let v = u.translate();

        expect(baseCase.vertex.copy().x).toBe(v.x);
        expect(baseCase.vertex.copy().y).toBe(v.y);
    });

    it('should default both arguments to 0 (static)', () => {
        let u = baseCase.vertex.copy();
        let v = Vertex.translate(u);

        expect(baseCase.vertex.copy().x).toBe(v.x);
        expect(baseCase.vertex.copy().y).toBe(v.y);
    });
});

describe('Scale', () => {
    type TestObject = { vertex: Vertex, factor: number, control: Vertex | undefined, scaled: Vertex };

    let cases: TestObject[] = [
        { vertex: vtx(0, 0), factor: 0, control: vtx(0, 0), scaled: vtx(0, 0) },
        { vertex: vtx(0, 0), factor: 2, control: vtx(0, 0), scaled: vtx(0, 0) },
        { vertex: vtx(0, 0), factor: 1, control: vtx(1, 1), scaled: vtx(0, 0) },
        { vertex: vtx(0, 0), factor: 2, control: vtx(1, 1), scaled: vtx(-1, -1) },
        { vertex: vtx(0, 0), factor: -1, control: vtx(1, 1), scaled: vtx(2, 2) },
        { vertex: vtx(3, 2), factor: -4, control: vtx(1, 2), scaled: vtx(-7, 2) },
        { vertex: vtx(5, 3), factor: 3, control: vtx(5, 7), scaled: vtx(5, -5) },
        { vertex: vtx(1, 2), factor: 2, control: undefined, scaled: vtx(2, 4) },
        { vertex: vtx(1, 2), factor: 2, control: vtx(0, 0), scaled: vtx(2, 4) },
    ];

    let baseCase = cases[3];

    cases.forEach(testCase => {
        let vertex = testCase.vertex.copy(), factor = testCase.factor, scaled = testCase.scaled.copy();
        if (testCase.control) {
            it(`should be ${scaled} when the vertex is ${vertex}, the scaling factor is ${factor} and the control is ${testCase.control} (instance)`, () => {
                let v = vertex.scale(factor, testCase.control);
                expect(v.x).toBeCloseTo(scaled.x);
                expect(v.y).toBeCloseTo(scaled.y);
            });
        }
        else {
            it(`should be ${scaled} when the vertex is ${vertex}, the scaling factor is ${factor} and the control is undefined (instance)`, () => {
                let v = vertex.scale(factor);
                expect(v.x).toBeCloseTo(scaled.x);
                expect(v.y).toBeCloseTo(scaled.y);
            });
        }
    });

    cases.forEach(testCase => {
        let vertex = testCase.vertex.copy(), factor = testCase.factor, scaled = testCase.scaled.copy();
        if (testCase.control) {
            it(`should be ${scaled} when the vertex is ${vertex}, the scaling factor is ${factor} and the control is ${testCase.control} (static)`, () => {
                let v = Vertex.scale(vertex, factor, testCase.control);
                expect(v.x).toBeCloseTo(scaled.x);
                expect(v.y).toBeCloseTo(scaled.y);
            });
        }
        else {
            it(`should be ${scaled} when the vertex is ${vertex}, the scaling factor is ${factor} and the control is undefined (static)`, () => {
                let v = Vertex.scale(vertex, factor);
                expect(v.x).toBeCloseTo(scaled.x);
                expect(v.y).toBeCloseTo(scaled.y);
            });
        }
    });

    it('should return the scaled instance when called on an object', () => {
        let u = baseCase.vertex.copy();
        let f = baseCase.factor;
        let c = (baseCase.control as Vertex).copy();

        let w = u.scale(f, c);
        expect(u.x).toBe(w.x);
        expect(u.y).toBe(w.y);
    });

    it('should not mutate the vertex when called statically', () => {
        let u = baseCase.vertex.copy();
        let f = baseCase.factor;
        let c = (baseCase.control as Vertex).copy();

        let w = Vertex.scale(u, f, c);
        expect(u.x).not.toBe(w.x);
        expect(u.y).not.toBe(w.y);
    });

    it('should default to the origin for the control point (instance)', () => {
        let u = baseCase.vertex.copy();
        let v = baseCase.vertex.copy();
        let f = baseCase.factor;

        let p = u.scale(f);
        let q = v.scale(f, vtx(0, 0));

        expect(p.x).toBe(q.x);
        expect(p.y).toBe(q.y);
    });

    it('should default to the origin for the control point (instance)', () => {
        let u = baseCase.vertex.copy();
        let v = baseCase.vertex.copy();
        let f = baseCase.factor;

        let p = Vertex.scale(u, f);
        let q = Vertex.scale(v, f, vtx(0, 0));

        expect(p.x).toBe(q.x);
        expect(p.y).toBe(q.y);
    });
});

describe('Rotate', () => {
    type TestObject = { vertex: Vertex, angle: number, control: Vertex | undefined, rotated: Vertex };

    let cases: TestObject[] = [
        { vertex: vtx(0, 0), angle: 0, control: vtx(0, 0), rotated: vtx(0, 0) },
        { vertex: vtx(0, 0), angle: Math.PI, control: vtx(0, 0), rotated: vtx(0, 0) },
        { vertex: vtx(0, 0), angle: 0, control: vtx(1, 1), rotated: vtx(0, 0) },
        { vertex: vtx(0, 0), angle: Math.PI, control: vtx(1, 1), rotated: vtx(2, 2) },
        { vertex: vtx(0, 0), angle: 2 * Math.PI, control: vtx(1, 1), rotated: vtx(0, 0) },
        { vertex: vtx(0, 0), angle: Math.PI / 2, control: vtx(1, 1), rotated: vtx(2, 0) },
        { vertex: vtx(3, 2), angle: -Math.PI / 4, control: vtx(1, 2), rotated: vtx(1 + 2 / (2 ** 0.5), 2 * (1 - 1 / (2 ** 0.5))) },
        { vertex: vtx(5, 7), angle: 13 * Math.PI / 6, control: vtx(5, 3), rotated: vtx(3, 3 + 2 * (3 ** 0.5)) },
        { vertex: vtx(1, 2), angle: Math.PI / 2, control: undefined, rotated: vtx(-2, 1) },
        { vertex: vtx(1, 2), angle: Math.PI / 2, control: vtx(0, 0), rotated: vtx(-2, 1) },
    ];

    let baseCase = cases[3];

    cases.forEach(testCase => {
        let vertex = testCase.vertex.copy(), angle = testCase.angle, rotated = testCase.rotated.copy();
        if (testCase.control) {
            it(`should be ${rotated} when the vertex is ${vertex}, the angle is ${angle} and the control is ${testCase.control} (instance)`, () => {
                let v = vertex.rotate(angle, testCase.control);
                expect(v.x).toBeCloseTo(rotated.x);
                expect(v.y).toBeCloseTo(rotated.y);
            });
        }
        else {
            it(`should be ${rotated} when the vertex is ${vertex}, the angle is ${angle} and the control is undefined (instance)`, () => {
                let v = vertex.rotate(angle);
                expect(v.x).toBeCloseTo(rotated.x);
                expect(v.y).toBeCloseTo(rotated.y);
            });
        }

    });

    cases.forEach(testCase => {
        let vertex = testCase.vertex.copy(), angle = testCase.angle, rotated = testCase.rotated.copy();
        if (testCase.control) {
            it(`should be ${rotated} when the vertex is ${vertex}, the angle is ${angle} and the control is ${testCase.control} (static)`, () => {
                let v = Vertex.rotate(vertex, angle, testCase.control);
                expect(v.x).toBeCloseTo(rotated.x);
                expect(v.y).toBeCloseTo(rotated.y);
            });
        }
        else {
            it(`should be ${rotated} when the vertex is ${vertex}, the angle is ${angle} and the control is undefined (static)`, () => {
                let v = Vertex.rotate(vertex, angle);
                expect(v.x).toBeCloseTo(rotated.x);
                expect(v.y).toBeCloseTo(rotated.y);
            });
        }
    });

    it('should return the rotated instance when called on an object', () => {
        let u = baseCase.vertex.copy();
        let a = baseCase.angle;
        let c = (baseCase.control as Vertex).copy();

        let w = u.rotate(a, c);
        expect(u.x).toBe(w.x);
        expect(u.y).toBe(w.y);
    });

    it('should not mutate the vertex when called statically', () => {
        let u = baseCase.vertex.copy();
        let a = baseCase.angle;
        let c = (baseCase.control as Vertex).copy();

        let w = Vertex.rotate(u, a, c);
        expect(u.x).not.toBe(w.x);
        expect(u.y).not.toBe(w.y);
    });

    it('should default to the origin for the control point (instance)', () => {
        let u = baseCase.vertex.copy();
        let v = baseCase.vertex.copy();
        let a = baseCase.angle;

        let p = u.rotate(a);
        let q = v.rotate(a, vtx(0, 0));

        expect(p.x).toBe(q.x);
        expect(p.y).toBe(q.y);
    });

    it('should default to the origin for the control point (instance)', () => {
        let u = baseCase.vertex.copy();
        let v = baseCase.vertex.copy();
        let a = baseCase.angle;

        let p = Vertex.rotate(u, a);
        let q = Vertex.rotate(v, a, vtx(0, 0));

        expect(p.x).toBe(q.x);
        expect(p.y).toBe(q.y);
    });
});

describe('Reflect', () => {
    type TestObject = { vertex: Vertex, axis: Vector, control: Vertex | undefined, reflected: Vertex };

    let cases: TestObject[] = [
        { vertex: vtx(0, 0), axis: vec(0, 0), control: vtx(0, 0), reflected: vtx(0, 0) },
        { vertex: vtx(0, 0), axis: vec(1, 1), control: vtx(0, 0), reflected: vtx(0, 0) },
        { vertex: vtx(0, 0), axis: vec(1, 1), control: vtx(1, 1), reflected: vtx(0, 0) },
        { vertex: vtx(0, 0), axis: vec(1, -1), control: vtx(1, 1), reflected: vtx(2, 2) },
        { vertex: vtx(0, 0), axis: vec(-1, -1), control: vtx(1, 1), reflected: vtx(0, 0) },
        { vertex: vtx(0, 0), axis: vec(0, 0), control: vtx(1, 1), reflected: vtx(0, 0) },
        { vertex: vtx(0, 0), axis: vec(0, 1), control: vtx(1, 1), reflected: vtx(2, 0) },
        { vertex: vtx(3, 2), axis: Vector.unit(-Math.PI / 8), control: vtx(1, 2), reflected: vtx(1 + 2 / (2 ** 0.5), 2 * (1 - 1 / (2 ** 0.5))) },
        { vertex: vtx(5, 7), axis: vec(-1, 1), control: vtx(5, 3), reflected: vtx(1, 3) },
        { vertex: vtx(1, 2), axis: vec(-1, 1), control: undefined, reflected: vtx(-2, -1) },
        { vertex: vtx(1, 2), axis: vec(-1, 1), control: vtx(0, 0), reflected: vtx(-2, -1) },
    ];

    let baseCase = cases[3];

    cases.forEach(testCase => {
        let vertex = testCase.vertex.copy(), axis = testCase.axis.copy(), reflected = testCase.reflected.copy();
        if (testCase.control) {
            it(`should be ${reflected} when the vertex is ${vertex}, the axis is ${axis} and the control is ${testCase.control} (instance)`, () => {
                let v = vertex.reflect(axis, testCase.control);
                expect(v.x).toBeCloseTo(reflected.x);
                expect(v.y).toBeCloseTo(reflected.y);
            });
        }
        else {
            it(`should be ${reflected} when the vertex is ${vertex}, the axis is ${axis} and the control is undefined (instance)`, () => {
                let v = vertex.reflect(axis);
                expect(v.x).toBeCloseTo(reflected.x);
                expect(v.y).toBeCloseTo(reflected.y);
            });
        }
    });

    cases.forEach(testCase => {
        let vertex = testCase.vertex.copy(), axis = testCase.axis.copy(), reflected = testCase.reflected.copy();
        if (testCase.control) {
            it(`should be ${reflected} when the vertex is ${vertex}, the axis is ${axis} and the control is ${testCase.control} (static)`, () => {
                let v = Vertex.reflect(vertex, axis, testCase.control);
                expect(v.x).toBeCloseTo(reflected.x);
                expect(v.y).toBeCloseTo(reflected.y);
            });
        }
        else {
            it(`should be ${reflected} when the vertex is ${vertex}, the axis is ${axis} and the control is undefined (static)`, () => {
                let v = Vertex.reflect(vertex, axis);
                expect(v.x).toBeCloseTo(reflected.x);
                expect(v.y).toBeCloseTo(reflected.y);
            });
        }
    });

    it('should return the reflected instance when called on an object', () => {
        let u = baseCase.vertex.copy();
        let a = baseCase.axis.copy();
        let c = (baseCase.control as Vertex).copy();

        let w = u.reflect(a, c);
        expect(u.x).toBe(w.x);
        expect(u.y).toBe(w.y);
    });

    it('should not mutate the vertex when called statically', () => {
        let u = baseCase.vertex.copy();
        let a = baseCase.axis.copy();
        let c = (baseCase.control as Vertex).copy();

        let w = Vertex.reflect(u, a, c);
        expect(u.x).not.toBe(w.x);
        expect(u.y).not.toBe(w.y);
    });


    it('should default to the origin for the control point (instance)', () => {
        let u = baseCase.vertex.copy();
        let v = baseCase.vertex.copy();
        let a = baseCase.axis.copy();

        let p = u.reflect(a);
        let q = v.reflect(a, vtx(0, 0));

        expect(p.x).toBe(q.x);
        expect(p.y).toBe(q.y);
    });

    it('should default to the origin for the control point (instance)', () => {
        let u = baseCase.vertex.copy();
        let v = baseCase.vertex.copy();
        let a = baseCase.axis.copy();

        let p = Vertex.reflect(u, a);
        let q = Vertex.reflect(v, a, vtx(0, 0));

        expect(p.x).toBe(q.x);
        expect(p.y).toBe(q.y);
    });
});

describe('Distance', () => {
    type TestObject = { vertexA: Vertex, vertexB: Vertex, distance: number };

    let cases: TestObject[] = [
        { vertexA: vtx(0, 0), vertexB: vtx(0, 0), distance: 0 },
        { vertexA: vtx(-1, 0), vertexB: vtx(1, 0), distance: 2 },
        { vertexA: vtx(1, 0), vertexB: vtx(-1, 0), distance: 2 },
        { vertexA: vtx(0, -1), vertexB: vtx(0, 1), distance: 2 },
        { vertexA: vtx(0, 1), vertexB: vtx(0, -1), distance: 2 },
        { vertexA: vtx(-1, -1), vertexB: vtx(2, 3), distance: 5 },
        { vertexA: vtx(-2, 1), vertexB: vtx(1, -3), distance: 5 },
    ];

    cases.forEach(testCase => {
        let vertexA = testCase.vertexA.copy(), vertexB = testCase.vertexB.copy(), distance = testCase.distance;
        it(`should be ${distance} when the vertices are ${vertexA} and ${vertexB} (instance)`, () => {
            let d = vertexA.distanceTo(vertexB);
            expect(d).toBeCloseTo(distance);
        });
    });

    cases.forEach(testCase => {
        let vertexA = testCase.vertexA.copy(), vertexB = testCase.vertexB.copy(), distance = testCase.distance;
        it(`should be ${distance} when the vertices are ${vertexA} and ${vertexB} (static)`, () => {
            let d = Vertex.distanceBetween(vertexA, vertexB);
            expect(d).toBeCloseTo(distance);
        });
    });
});

describe('Angle', () => {
    type TestObject = { vertexA: Vertex, vertexB: Vertex, heading: number, angle: number };

    let cases: TestObject[] = [
        { vertexA: vtx(0, 0), vertexB: vtx(0, 0), heading: 0, angle: 0 },
        { vertexA: vtx(0, 0), vertexB: vtx(0, 0), heading: Math.PI / 2, angle: -Math.PI / 2 },
        { vertexA: vtx(-1, 0), vertexB: vtx(1, 0), heading: Math.PI / 4, angle: -Math.PI / 4 },
        { vertexA: vtx(1, 0), vertexB: vtx(-1, 0), heading: Math.PI / 4, angle: 3 * Math.PI / 4 },
        { vertexA: vtx(0, -1), vertexB: vtx(0, 1), heading: -Math.PI / 4, angle: 3 * Math.PI / 4 },
        { vertexA: vtx(0, 1), vertexB: vtx(0, -1), heading: -Math.PI / 4, angle: -Math.PI / 4 },
    ];

    cases.forEach(testCase => {
        let vertexA = testCase.vertexA.copy(), vertexB = testCase.vertexB.copy(), heading = testCase.heading, angle = testCase.angle;
        it(`should be ${angle} when the vertices are ${vertexA} and ${vertexB} with a heading of ${heading} (instance)`, () => {
            let d = vertexA.angleTo(vertexB, heading);
            expect(d).toBeCloseTo(angle);
        });
    });

    cases.forEach(testCase => {
        let vertexA = testCase.vertexA.copy(), vertexB = testCase.vertexB.copy(), heading = testCase.heading, angle = testCase.angle;
        it(`should be ${angle} when the vertices are ${vertexA} and ${vertexB} with a heading of ${heading} (static)`, () => {
            let d = Vertex.angleBetween(vertexA, vertexB, heading);
            expect(d).toBeCloseTo(angle);
        });
    });
});

describe('Equivalency', () => {
    type TestObject = { vertexA: Vertex, vertexB: Vertex, equivalent: boolean };

    let cases: TestObject[] = [
        { vertexA: vtx(0, 0), vertexB: vtx(0, 0), equivalent: true },
        { vertexA: vtx(0, 0), vertexB: vtx(1E-9, 1E-9), equivalent: false },
        { vertexA: vtx(0, 0), vertexB: vtx(1E-9 - 1E-10, 1E-9 - 1E-10), equivalent: true },
    ];

    cases.forEach(testCase => {
        let vertexA = testCase.vertexA.copy(), vertexB = testCase.vertexB.copy(), equivalent = testCase.equivalent;
        it(`should be ${equivalent} when the vertices are ${vertexA} and ${vertexB} (instance)`, () => {
            let e = vertexA.isEquivalentTo(vertexB);
            expect(e).toBe(equivalent);
        });
    });
});


describe('Mean', () => {
    type TestObject = { vertices: Vertex[], mean: Vertex };

    let cases: TestObject[] = [
        { vertices: [vtx(0, 0)], mean: vtx(0, 0) },
        { vertices: [vtx(1, 2)], mean: vtx(1, 2) },
        { vertices: [vtx(1, 2), vtx(1, 2), vtx(1, 2)], mean: vtx(1, 2) },
        { vertices: [vtx(1, 2), vtx(-1, -2)], mean: vtx(0, 0) },
    ];

    cases.forEach(testCase => {
        let vertices = testCase.vertices.slice(), mean = testCase.mean.copy();
        it(`should be ${mean} when the vertices are ${vertices}`, () => {
            let actual = Vertex.mean(vertices);
            expect(actual.x).toBeCloseTo(mean.x);
            expect(actual.y).toBeCloseTo(mean.y);
        });
    });
});
