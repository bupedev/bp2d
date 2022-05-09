import { edge, Edge } from '../../src/edge'
import { vec, Vector } from '../../src/vector';
import { vtx, Vertex } from '../../src/vertex';

describe('Constructor', () => {
    it('should store vertices correctly', () => {
        let u = vtx(1, 2);
        let v = vtx(2, 1);
        let e = new Edge(u, v);

        expect(e.start).toBe(u);
        expect(e.end).toBe(v);
    });
});

describe('Shorthand Constructor', () => {
    it('should store vertices correctly', () => {
        let u = vtx(1, 2);
        let v = vtx(2, 1);
        let e = edge(u, v);

        expect(e.start).toBe(u);
        expect(e.end).toBe(v);
    });
});

describe('Copy', () => {
    it('should return an edge with equivalent start and end vectors', () => {
        let u = vtx(1, 2);
        let v = vtx(2, 1);
        let e0 = edge(u, v);
        let e1 = e0.copy();

        expect(e1.start).not.toBe(e0.start);
        expect(e1.start).toStrictEqual(e0.start);
        expect(e1.end).not.toBe(e0.end);
        expect(e1.end).toStrictEqual(e0.end);
    });

    it('should return a distinctly different vector instance', () => {
        let u = vtx(1, 2);
        let v = vtx(2, 1);
        let e0 = edge(u, v);
        let e1 = e0.copy();

        e0.start = v, e0.end = u;

        expect(e1.start).not.toStrictEqual(e0.start);
        expect(e1.end).not.toStrictEqual(e0.end);
    });
});

describe('Direction', () => {
    type TestObject = { edge: Edge, reverse: boolean, direction: Vector };

    let cases: TestObject[] = [
        { edge: edge(vtx(0, 0), vtx(0, 0)), reverse: false, direction: vec(0, 0) },
        { edge: edge(vtx(0, 0), vtx(0, 0)), reverse: true, direction: vec(0, 0) },
        { edge: edge(vtx(0, 0), vtx(1, 1)), reverse: false, direction: vec(1, 1) },
        { edge: edge(vtx(0, 0), vtx(1, 1)), reverse: true, direction: vec(-1, -1) },
        { edge: edge(vtx(2, 3), vtx(-5, 8)), reverse: false, direction: vec(-7, 5) },
        { edge: edge(vtx(2, 3), vtx(-5, 8)), reverse: true, direction: vec(7, -5) },
        { edge: edge(vtx(-1, -4), vtx(4, 3)), reverse: false, direction: vec(5, 7) },
        { edge: edge(vtx(-1, -4), vtx(4, 3)), reverse: true, direction: vec(-5, -7) },
    ];

    cases.forEach(testCase => {
        let edge = testCase.edge.copy(), reverse = testCase.reverse, direction = testCase.direction.copy();
        it(`should be ${direction} when the edge is ${edge} and is ${reverse ? "" : "not "}reversed`, () => {
            let u = edge.direction(reverse);
            expect(u.x).toBeCloseTo(direction.x);
            expect(u.y).toBeCloseTo(direction.y);
        });
    });

    it('should not reverse direction by default', () => {
        let u = vtx(1, 2);
        let v = vtx(2, 1);
        let e = edge(u, v);

        let d0 = e.direction();
        let d1 = e.direction(false);

        expect(d0.x).toBeCloseTo(d1.x);
        expect(d0.y).toBeCloseTo(d1.y);
    });
});

describe('Normal', () => {
    type TestObject = { edge: Edge, clockwise: boolean, normal: Vector };

    let cases: TestObject[] = [
        { edge: edge(vtx(0, 0), vtx(0, 0)), clockwise: false, normal: vec(0, 0) },
        { edge: edge(vtx(0, 0), vtx(0, 0)), clockwise: true, normal: vec(0, 0) },
        { edge: edge(vtx(0, 0), vtx(1, 1)), clockwise: false, normal: vec(1/(2**0.5), -1/(2**0.5)) },
        { edge: edge(vtx(0, 0), vtx(1, 1)), clockwise: true, normal: vec(-1/(2**0.5), 1/(2**0.5)) },
        { edge: edge(vtx(2, 3), vtx(-1, 7)), clockwise: false, normal: vec(4/5, 3/5) },
        { edge: edge(vtx(2, 3), vtx(-1, 7)), clockwise: true, normal: vec(-4/5, -3/5) },
        { edge: edge(vtx(-1, -4), vtx(3, -1)), clockwise: false, normal: vec(3/5, -4/5) },
        { edge: edge(vtx(-1, -4), vtx(3, -1)), clockwise: true, normal: vec(-3/5, 4/5) },
    ];

    cases.forEach(testCase => {
        let edge = testCase.edge.copy(), clockwise = testCase.clockwise, normal = testCase.normal.copy();
        it(`should be ${normal} when the edge is ${edge} and is ${clockwise ? "" : "counter-"}clockwise`, () => {
            let u = edge.normal(clockwise);
            expect(u.x).toBeCloseTo(normal.x);
            expect(u.y).toBeCloseTo(normal.y);
        });
    });

    it('should not assume counter-clockwise edge by default', () => {
        let u = vtx(1, 2);
        let v = vtx(2, 1);
        let e = edge(u, v);

        let n0 = e.normal();
        let n1 = e.normal(false);

        expect(n0.x).toBeCloseTo(n1.x);
        expect(n0.y).toBeCloseTo(n1.y);
    });
});

describe('Length', () => {
    type TestObject = { edge: Edge, length: number };

    let cases: TestObject[] = [
        { edge: edge(vtx(0, 0), vtx(0, 0)), length: 0 },
        { edge: edge(vtx(0, 0), vtx(1, 1)), length: 2 ** 0.5 },
        { edge: edge(vtx(-1, -3), vtx(2, 1)), length: 5 },
        { edge: edge(vtx(3, -6), vtx(-2, 6)), length: 13 },
    ];

    cases.forEach(testCase => {
        let edge = testCase.edge.copy(), length = testCase.length;
        it(`should be ${length} when the edge is ${edge}`, () => {
            let l = edge.length();
            expect(l).toBeCloseTo(length);
        });
    });
});

describe('Intersect Edge', () => {
    type TestObject = { edgeA: Edge, edgeB: Edge, intersect: Vertex };

    let cases: TestObject[] = [
        {edgeA: edge(vtx(0, 0),   vtx(0, 0)), edgeB: edge(vtx(0, 0),   vtx(0, 0)), intersect: null},
        {edgeA: edge(vtx(-1, -1), vtx(1, 1)), edgeB: edge(vtx(-1, 1),  vtx(1, -1)), intersect: vtx(0,0)},
        {edgeA: edge(vtx(-2, 0),  vtx(4, 2)), edgeB: edge(vtx(-1, -3), vtx(2, 3)), intersect: vtx(1,1)},
        {edgeA: edge(vtx(-2, 0),  vtx(4, 2)), edgeB: edge(vtx(-1, -3), vtx(0, -1)), intersect: null},
        {edgeA: edge(vtx(-2, 0),  vtx(4, 2)), edgeB: edge(vtx(-2, -1), vtx(4, 1)), intersect: null},
        {edgeA: edge(vtx(-2, 0),  vtx(4, 2)), edgeB: edge(vtx(-2, 0),  vtx(4, 2)), intersect: null},
    ];

    cases.forEach(testCase => {
        let edgeA = testCase.edgeA.copy(), edgeB = testCase.edgeB.copy(), intersect = testCase.intersect ? testCase.intersect.copy() : null;
        it(`should be ${intersect} when the edges are ${edgeA} and ${edgeB}`, () => {
            let i = edgeA.intersectEdge(edgeB);
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