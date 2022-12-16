import { vec, Vector, vtx, Vertex, lineSegment, LineSegment } from '../../../src/index';

describe('Constructor', () => {
    it('should store vertices correctly', () => {
        let u = vtx(1, 2);
        let v = vtx(2, 1);
        let e = new LineSegment(u, v);

        expect(e.start).toBe(u);
        expect(e.end).toBe(v);
    });
});

describe('Shorthand Constructor', () => {
    it('should store vertices correctly', () => {
        let u = vtx(1, 2);
        let v = vtx(2, 1);
        let e = lineSegment(u, v);

        expect(e.start).toBe(u);
        expect(e.end).toBe(v);
    });
});

describe('Copy', () => {
    it('should return an lineSegment with equivalent start and end vectors', () => {
        let u = vtx(1, 2);
        let v = vtx(2, 1);
        let e0 = lineSegment(u, v);
        let e1 = e0.copy();

        expect(e1.start).not.toBe(e0.start);
        expect(e1.start).toStrictEqual(e0.start);
        expect(e1.end).not.toBe(e0.end);
        expect(e1.end).toStrictEqual(e0.end);
    });

    it('should return a distinctly different vector instance', () => {
        let u = vtx(1, 2);
        let v = vtx(2, 1);
        let e0 = lineSegment(u, v);
        let e1 = e0.copy();

        e0.start = v, e0.end = u;

        expect(e1.start).not.toStrictEqual(e0.start);
        expect(e1.end).not.toStrictEqual(e0.end);
    });
});

describe('Direction', () => {
    type TestObject = { lineSegment: LineSegment, reverse: boolean, direction: Vector };

    let cases: TestObject[] = [
        { lineSegment: lineSegment(vtx(0, 0), vtx(0, 0)), reverse: false, direction: vec(0, 0) },
        { lineSegment: lineSegment(vtx(0, 0), vtx(0, 0)), reverse: true, direction: vec(0, 0) },
        { lineSegment: lineSegment(vtx(0, 0), vtx(1, 1)), reverse: false, direction: vec(1, 1) },
        { lineSegment: lineSegment(vtx(0, 0), vtx(1, 1)), reverse: true, direction: vec(-1, -1) },
        { lineSegment: lineSegment(vtx(2, 3), vtx(-5, 8)), reverse: false, direction: vec(-7, 5) },
        { lineSegment: lineSegment(vtx(2, 3), vtx(-5, 8)), reverse: true, direction: vec(7, -5) },
        { lineSegment: lineSegment(vtx(-1, -4), vtx(4, 3)), reverse: false, direction: vec(5, 7) },
        { lineSegment: lineSegment(vtx(-1, -4), vtx(4, 3)), reverse: true, direction: vec(-5, -7) },
    ];

    cases.forEach(testCase => {
        let lineSegment = testCase.lineSegment.copy(), reverse = testCase.reverse, direction = testCase.direction.copy();
        it(`should be ${direction} when the lineSegment is ${lineSegment} and is ${reverse ? "" : "not "}reversed`, () => {
            let u = lineSegment.direction(reverse);
            expect(u.x).toBeCloseTo(direction.x);
            expect(u.y).toBeCloseTo(direction.y);
        });
    });

    it('should not reverse direction by default', () => {
        let u = vtx(1, 2);
        let v = vtx(2, 1);
        let e = lineSegment(u, v);

        let d0 = e.direction();
        let d1 = e.direction(false);

        expect(d0.x).toBeCloseTo(d1.x);
        expect(d0.y).toBeCloseTo(d1.y);
    });
});

describe('Normal', () => {
    type TestObject = { lineSegment: LineSegment, clockwise: boolean, normal: Vector };

    let cases: TestObject[] = [
        { lineSegment: lineSegment(vtx(0, 0), vtx(0, 0)), clockwise: false, normal: vec(0, 0) },
        { lineSegment: lineSegment(vtx(0, 0), vtx(0, 0)), clockwise: true, normal: vec(0, 0) },
        { lineSegment: lineSegment(vtx(0, 0), vtx(1, 1)), clockwise: false, normal: vec(1 / (2 ** 0.5), -1 / (2 ** 0.5)) },
        { lineSegment: lineSegment(vtx(0, 0), vtx(1, 1)), clockwise: true, normal: vec(-1 / (2 ** 0.5), 1 / (2 ** 0.5)) },
        { lineSegment: lineSegment(vtx(2, 3), vtx(-1, 7)), clockwise: false, normal: vec(4 / 5, 3 / 5) },
        { lineSegment: lineSegment(vtx(2, 3), vtx(-1, 7)), clockwise: true, normal: vec(-4 / 5, -3 / 5) },
        { lineSegment: lineSegment(vtx(-1, -4), vtx(3, -1)), clockwise: false, normal: vec(3 / 5, -4 / 5) },
        { lineSegment: lineSegment(vtx(-1, -4), vtx(3, -1)), clockwise: true, normal: vec(-3 / 5, 4 / 5) },
    ];

    cases.forEach(testCase => {
        let lineSegment = testCase.lineSegment.copy(), clockwise = testCase.clockwise, normal = testCase.normal.copy();
        it(`should be ${normal} when the lineSegment is ${lineSegment} and is ${clockwise ? "" : "counter-"}clockwise`, () => {
            let u = lineSegment.normal(clockwise);
            expect(u.x).toBeCloseTo(normal.x);
            expect(u.y).toBeCloseTo(normal.y);
        });
    });

    it('should not assume counter-clockwise lineSegment by default', () => {
        let u = vtx(1, 2);
        let v = vtx(2, 1);
        let e = lineSegment(u, v);

        let n0 = e.normal();
        let n1 = e.normal(false);

        expect(n0.x).toBeCloseTo(n1.x);
        expect(n0.y).toBeCloseTo(n1.y);
    });
});

describe('Length', () => {
    type TestObject = { lineSegment: LineSegment, length: number };

    let cases: TestObject[] = [
        { lineSegment: lineSegment(vtx(0, 0), vtx(0, 0)), length: 0 },
        { lineSegment: lineSegment(vtx(0, 0), vtx(1, 1)), length: 2 ** 0.5 },
        { lineSegment: lineSegment(vtx(-1, -3), vtx(2, 1)), length: 5 },
        { lineSegment: lineSegment(vtx(3, -6), vtx(-2, 6)), length: 13 },
    ];

    cases.forEach(testCase => {
        let lineSegment = testCase.lineSegment.copy(), length = testCase.length;
        it(`should be ${length} when the lineSegment is ${lineSegment}`, () => {
            let l = lineSegment.length();
            expect(l).toBeCloseTo(length);
        });
    });
});

describe('Intersect LineSegment', () => {
    type TestObject = { lineSegmentA: LineSegment, lineSegmentB: LineSegment, intersect: Vertex | undefined };

    let cases: TestObject[] = [
        { lineSegmentA: lineSegment(vtx(0, 0), vtx(0, 0)), lineSegmentB: lineSegment(vtx(0, 0), vtx(0, 0)), intersect: undefined },
        { lineSegmentA: lineSegment(vtx(-1, -1), vtx(1, 1)), lineSegmentB: lineSegment(vtx(-1, 1), vtx(1, -1)), intersect: vtx(0, 0) },
        { lineSegmentA: lineSegment(vtx(-2, 0), vtx(4, 2)), lineSegmentB: lineSegment(vtx(-1, -3), vtx(2, 3)), intersect: vtx(1, 1) },
        { lineSegmentA: lineSegment(vtx(-2, 0), vtx(4, 2)), lineSegmentB: lineSegment(vtx(-1, -3), vtx(0, -1)), intersect: undefined },
        { lineSegmentA: lineSegment(vtx(-2, 0), vtx(4, 2)), lineSegmentB: lineSegment(vtx(-2, -1), vtx(4, 1)), intersect: undefined },
        { lineSegmentA: lineSegment(vtx(-2, 0), vtx(4, 2)), lineSegmentB: lineSegment(vtx(-2, 0), vtx(4, 2)), intersect: undefined },
    ];

    cases.forEach(testCase => {
        let lineSegmentA = testCase.lineSegmentA.copy(), lineSegmentB = testCase.lineSegmentB.copy(), intersect = testCase.intersect;
        it(`should be ${intersect} when the lineSegments are ${lineSegmentA} and ${lineSegmentB}`, () => {
            let i = lineSegmentA.intersectLineSegment(lineSegmentB);
            if (intersect) {
                expect(i!.x).toBeCloseTo(intersect.x);
                expect(i!.y).toBeCloseTo(intersect.y);
            }
            else {
                expect(i).toBeNull();
            }
        });
    });
});

describe('Lerp', () => {
    type TestObject = { start: LineSegment, end: LineSegment, proportion: number, lerped: LineSegment };

    let cases: TestObject[] = [
        { start: lineSegment(vtx(0, 0), vtx(2, 2)), end: lineSegment(vtx(0, 0), vtx(2, 2)), proportion: 0, lerped: lineSegment(vtx(0, 0), vtx(2, 2)) },
        { start: lineSegment(vtx(0, 0), vtx(2, 2)), end: lineSegment(vtx(0, 0), vtx(2, 2)), proportion: 1, lerped: lineSegment(vtx(0, 0), vtx(2, 2)) },
        { start: lineSegment(vtx(0, 0), vtx(2, 2)), end: lineSegment(vtx(-2, -2), vtx(0, 0)), proportion: 0, lerped: lineSegment(vtx(0, 0), vtx(2, 2)) },
        { start: lineSegment(vtx(0, 0), vtx(2, 2)), end: lineSegment(vtx(-2, -2), vtx(0, 0)), proportion: 1, lerped: lineSegment(vtx(-2, -2), vtx(0, 0)) },
        { start: lineSegment(vtx(0, 0), vtx(2, 2)), end: lineSegment(vtx(-2, -2), vtx(0, 0)), proportion: 0.5, lerped: lineSegment(vtx(-1, -1), vtx(1, 1)) },
        { start: lineSegment(vtx(0, 0), vtx(2, 2)), end: lineSegment(vtx(-2, -2), vtx(0, 0)), proportion: -0.5, lerped: lineSegment(vtx(1, 1), vtx(3, 3)) }
    ];

    cases.forEach(testCase => {
        let start = testCase.start, end = testCase.end, proportion = testCase.proportion, lerped = testCase.lerped;
        it(`should be ${lerped} when the start is ${start}, the end is ${end} and the proportion is ${proportion}.`, () => {
            let actual = LineSegment.lerp(start, end, proportion);
            expect(actual.start.x).toBeCloseTo(lerped.start.x);
            expect(actual.start.y).toBeCloseTo(lerped.start.y);
            expect(actual.end.x).toBeCloseTo(lerped.end.x);
            expect(actual.end.y).toBeCloseTo(lerped.end.y);
        });
    });
});