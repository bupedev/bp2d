import { vec, Vector, vtx, Vertex, line, Line } from '../../../src/index';

describe('Constructor', () => {
    it('should store vertices correctly', () => {
        let u = vtx(1, 2);
        let v = vtx(2, 1);
        let e = new Line(u, v);

        expect(e.start).toBe(u);
        expect(e.end).toBe(v);
    });
});

describe('Shorthand Constructor', () => {
    it('should store vertices correctly', () => {
        let u = vtx(1, 2);
        let v = vtx(2, 1);
        let e = line(u, v);

        expect(e.start).toBe(u);
        expect(e.end).toBe(v);
    });
});

describe('Copy', () => {
    it('should return an line with equivalent start and end vectors', () => {
        let u = vtx(1, 2);
        let v = vtx(2, 1);
        let e0 = line(u, v);
        let e1 = e0.copy();

        expect(e1.start).not.toBe(e0.start);
        expect(e1.start).toStrictEqual(e0.start);
        expect(e1.end).not.toBe(e0.end);
        expect(e1.end).toStrictEqual(e0.end);
    });

    it('should return a distinctly different vector instance', () => {
        let u = vtx(1, 2);
        let v = vtx(2, 1);
        let e0 = line(u, v);
        let e1 = e0.copy();

        e0.start = v, e0.end = u;

        expect(e1.start).not.toStrictEqual(e0.start);
        expect(e1.end).not.toStrictEqual(e0.end);
    });
});

describe('Direction', () => {
    type TestObject = { line: Line, reverse: boolean, direction: Vector };

    let cases: TestObject[] = [
        { line: line(vtx(0, 0), vtx(0, 0)), reverse: false, direction: vec(0, 0) },
        { line: line(vtx(0, 0), vtx(0, 0)), reverse: true, direction: vec(0, 0) },
        { line: line(vtx(0, 0), vtx(1, 1)), reverse: false, direction: vec(1, 1) },
        { line: line(vtx(0, 0), vtx(1, 1)), reverse: true, direction: vec(-1, -1) },
        { line: line(vtx(2, 3), vtx(-5, 8)), reverse: false, direction: vec(-7, 5) },
        { line: line(vtx(2, 3), vtx(-5, 8)), reverse: true, direction: vec(7, -5) },
        { line: line(vtx(-1, -4), vtx(4, 3)), reverse: false, direction: vec(5, 7) },
        { line: line(vtx(-1, -4), vtx(4, 3)), reverse: true, direction: vec(-5, -7) },
    ];

    cases.forEach(testCase => {
        let line = testCase.line.copy(), reverse = testCase.reverse, direction = testCase.direction.copy();
        it(`should be ${direction} when the line is ${line} and is ${reverse ? "" : "not "}reversed`, () => {
            let u = line.direction(reverse);
            expect(u.x).toBeCloseTo(direction.x);
            expect(u.y).toBeCloseTo(direction.y);
        });
    });

    it('should not reverse direction by default', () => {
        let u = vtx(1, 2);
        let v = vtx(2, 1);
        let e = line(u, v);

        let d0 = e.direction();
        let d1 = e.direction(false);

        expect(d0.x).toBeCloseTo(d1.x);
        expect(d0.y).toBeCloseTo(d1.y);
    });
});

describe('Normal', () => {
    type TestObject = { line: Line, clockwise: boolean, normal: Vector };

    let cases: TestObject[] = [
        { line: line(vtx(0, 0), vtx(0, 0)), clockwise: false, normal: vec(0, 0) },
        { line: line(vtx(0, 0), vtx(0, 0)), clockwise: true, normal: vec(0, 0) },
        { line: line(vtx(0, 0), vtx(1, 1)), clockwise: false, normal: vec(1 / (2 ** 0.5), -1 / (2 ** 0.5)) },
        { line: line(vtx(0, 0), vtx(1, 1)), clockwise: true, normal: vec(-1 / (2 ** 0.5), 1 / (2 ** 0.5)) },
        { line: line(vtx(2, 3), vtx(-1, 7)), clockwise: false, normal: vec(4 / 5, 3 / 5) },
        { line: line(vtx(2, 3), vtx(-1, 7)), clockwise: true, normal: vec(-4 / 5, -3 / 5) },
        { line: line(vtx(-1, -4), vtx(3, -1)), clockwise: false, normal: vec(3 / 5, -4 / 5) },
        { line: line(vtx(-1, -4), vtx(3, -1)), clockwise: true, normal: vec(-3 / 5, 4 / 5) },
    ];

    cases.forEach(testCase => {
        let line = testCase.line.copy(), clockwise = testCase.clockwise, normal = testCase.normal.copy();
        it(`should be ${normal} when the line is ${line} and is ${clockwise ? "" : "counter-"}clockwise`, () => {
            let u = line.normal(clockwise);
            expect(u.x).toBeCloseTo(normal.x);
            expect(u.y).toBeCloseTo(normal.y);
        });
    });

    it('should not assume counter-clockwise line by default', () => {
        let u = vtx(1, 2);
        let v = vtx(2, 1);
        let e = line(u, v);

        let n0 = e.normal();
        let n1 = e.normal(false);

        expect(n0.x).toBeCloseTo(n1.x);
        expect(n0.y).toBeCloseTo(n1.y);
    });
});

describe('Length', () => {
    type TestObject = { line: Line, length: number };

    let cases: TestObject[] = [
        { line: line(vtx(0, 0), vtx(0, 0)), length: 0 },
        { line: line(vtx(0, 0), vtx(1, 1)), length: 2 ** 0.5 },
        { line: line(vtx(-1, -3), vtx(2, 1)), length: 5 },
        { line: line(vtx(3, -6), vtx(-2, 6)), length: 13 },
    ];

    cases.forEach(testCase => {
        let line = testCase.line.copy(), length = testCase.length;
        it(`should be ${length} when the line is ${line}`, () => {
            let l = line.length();
            expect(l).toBeCloseTo(length);
        });
    });
});

describe('Intersect Line', () => {
    type TestObject = { lineA: Line, lineB: Line, intersect: Vertex | undefined };

    let cases: TestObject[] = [
        { lineA: line(vtx(0, 0), vtx(0, 0)), lineB: line(vtx(0, 0), vtx(0, 0)), intersect: undefined },
        { lineA: line(vtx(-1, -1), vtx(1, 1)), lineB: line(vtx(-1, 1), vtx(1, -1)), intersect: vtx(0, 0) },
        { lineA: line(vtx(-2, 0), vtx(4, 2)), lineB: line(vtx(-1, -3), vtx(2, 3)), intersect: vtx(1, 1) },
        { lineA: line(vtx(-2, 0), vtx(4, 2)), lineB: line(vtx(-1, -3), vtx(0, -1)), intersect: undefined },
        { lineA: line(vtx(-2, 0), vtx(4, 2)), lineB: line(vtx(-2, -1), vtx(4, 1)), intersect: undefined },
        { lineA: line(vtx(-2, 0), vtx(4, 2)), lineB: line(vtx(-2, 0), vtx(4, 2)), intersect: undefined },
    ];

    cases.forEach(testCase => {
        let lineA = testCase.lineA.copy(), lineB = testCase.lineB.copy(), intersect = testCase.intersect;
        it(`should be ${intersect} when the lines are ${lineA} and ${lineB}`, () => {
            let i = lineA.intersectLine(lineB);
            if (intersect) {
                expect(i.x).toBeCloseTo(intersect.x);
                expect(i.y).toBeCloseTo(intersect.y);
            }
            else {
                expect(i).toBeNull();
            }
        });
    });
});