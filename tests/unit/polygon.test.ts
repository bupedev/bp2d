import { vec, Vector } from '../../src/vector';
import { vtx, Vertex } from '../../src/vertex';
import { edge, Edge } from '../../src/edge';
import { poly, Polygon } from '../../src/polygon';

function expectPolygonEquivalency(actual: Polygon, expected: Polygon): void {
    expect(actual.vertices.length).toBe(expected.vertices.length);
    for (let i = 0; i < actual.vertices.length; i++) {
        expect(actual.vertices[i].isEquivalentTo(expected.vertices[i])).toBeTruthy();
    }
}

function expectPolygonInequality(actual: Polygon, expected: Polygon): void {
    expect(actual.vertices.length).toBe(expected.vertices.length);
    expect(actual.vertices.every((vertex, index) => {vertex.isEquivalentTo(expected.vertices[index])})).toBeFalsy();
}
 
let testVertices = {
    "square": [
        vtx(1, 1),
        vtx(1, -1),
        vtx(-1, -1),
        vtx(-1, 1),
    ],
    "offsetSquare": [
        vtx(1, 1),
        vtx(1, 0),
        vtx(0, 0),
        vtx(0, 1),
    ],
    "boomerang": [
        vtx(1, 0),
        vtx(3, 5),
        vtx(-2, 0),
        vtx(3, -5)
    ],
    "kissingTriangles": [
        vtx(1, 1),
        vtx(1, -1),
        vtx(-1, 1),
        vtx(-1, -1)
    ],
    "twisted": [
        vtx(0, 1),
        vtx(0, -1),
        vtx(-1, 0),
        vtx(1, 0),
        vtx(1, 2),
        vtx(2, 1)
    ]
};

let testEdges = {
    "square": [
        edge(vtx(1, 1), vtx(1, -1)),
        edge(vtx(1, -1), vtx(-1, -1)),
        edge(vtx(-1, -1), vtx(-1, 1)),
        edge(vtx(-1, 1), vtx(1, 1))
    ]
};

describe('Constructor', () => {
    it('should store vertices correctly', () => {
        let vertices = testVertices.square.slice();
        let polygon = new Polygon(vertices);
        let stored = polygon.vertices;

        expect(stored.length).toBe(vertices.length);
        for (var i = 0; i < vertices.length; i++) {
            expect(stored[i]).toStrictEqual(vertices[i]);
        }
    });

    it('should compute edges correctly', () => {
        let vertices = testVertices.square.slice();
        let edges = testEdges.square.slice();
        let polygon = new Polygon(vertices);
        let stored = polygon.edges;

        expect(stored.length).toBe(edges.length);
        for (var i = 0; i < vertices.length; i++) {
            expect(stored[i]).toStrictEqual(edges[i]);
        }
    });

    it('should compute the orientation correctly', () => {
        let vertices = testVertices.square.slice();
        let cwPolygon = new Polygon(vertices);
        let ccwPolygon = new Polygon(vertices.reverse());

        expect(cwPolygon.clockwise).toBeTruthy();
        expect(ccwPolygon.clockwise).toBeFalsy();
    });

    it('should compute the anchor point correctly', () => {
        let vertices = testVertices.offsetSquare.slice();
        let polygon = new Polygon(vertices);

        expect(polygon.anchor).toStrictEqual(vtx(0.5, 0.5));
    });

    it('should store coordinates correctly', () => {
        let x = 1;
        let y = 2;
        let v = new Vertex(x, y);

        expect(v.x).toBe(x);
        expect(v.y).toBe(y);
    });
});

describe('Vertices Accessor', () => {
    it('should store a copy of the vertices', () => {
        let vertices = testVertices.square.slice();

        let polygon = new Polygon(vertices);
        vertices[0] = vtx(0, 0);
        let stored = polygon.vertices;

        expect(vertices[0]).not.toBe(stored[0]);
    });

    it('should return a copy of the vertices', () => {
        let vertices = testVertices.square.slice();

        let polygon = new Polygon(vertices);
        let storedA = polygon.vertices;
        storedA[0] = vtx(0, 0);
        let storedB = polygon.vertices;

        expect(storedB[0]).not.toBe(storedA[0]);
    });

    it('should return a copy of the vertices', () => {
        let vertices = testVertices.square.slice();

        let polygon = new Polygon(vertices);
        let storedA = polygon.vertices;
        storedA[0].x = 0;
        let storedB = polygon.vertices;

        expect(storedB[0]).not.toBe(storedA[0]);
    });
});

describe('Edges Accessor', () => {
    it('should return a copy of the edges', () => {
        let vertices = testVertices.square.slice();

        let polygon = new Polygon(vertices);
        let storedA = polygon.edges;
        storedA[0] = edge(vtx(0, 0), vtx(2, 2));
        let storedB = polygon.edges;

        expect(storedB[0]).not.toBe(storedA[0]);
    });

    it('should return distinct instances of the edges', () => {
        let vertices = testVertices.square.slice();

        let polygon = new Polygon(vertices);
        let storedA = polygon.edges;
        storedA[0].start = vtx(0,0);
        let storedB = polygon.edges;

        expect(storedB[0]).not.toBe(storedA[0]);
    });
});

describe('Shorthand Constructor', () => {
    it('should produce identical output to the main constructor', () => {
        let vertices = testVertices.square.slice();

        let main = new Polygon(vertices);
        let shorthand = poly(vertices);

        expect(shorthand).toStrictEqual(main);
    });
});

describe('Copy', () => {
    it('should return a polygon with the same vertices, edges, orientation and anchor', () => {
        let vertices = testVertices.square.slice();

        let polygon = poly(vertices);
        let copy = polygon.copy();

        expect(copy).toStrictEqual(polygon);
    });

    it('should return a distinctly different polygon instance', () => {
        let vertices = testVertices.square.slice();

        let polygon = poly(vertices);
        let copy = polygon.copy();

        polygon.anchor = vtx(5, 5);

        expect(copy).not.toStrictEqual(polygon);
    });
});

// See https://www.desmos.com/calculator/8rbyeadagn
describe('Intersect Edge', () => {
    type TestObject = { polygon: Polygon, edge: Edge, intersections: Vertex[] };

    let boomerang = poly(testVertices.boomerang.slice());
    
    let cases: TestObject[] = [
        { polygon: boomerang, edge: edge(vtx(0, 0), vtx(0, 0)), intersections: [] },
        { polygon: boomerang, edge: edge(vtx(0, -1), vtx(0, 1)), intersections: [] },
        { polygon: boomerang, edge: edge(vtx(0, -4), vtx(0, 4)), intersections: [vtx(0, -2), vtx(0, 2)] },
        { polygon: boomerang, edge: edge(vtx(0, 4), vtx(0, -4)), intersections: [vtx(0, 2), vtx(0, -2)] },
        { polygon: boomerang, edge: edge(vtx(0, -2), vtx(0, 2)), intersections: [vtx(0, -2), vtx(0, 2)] },
        { polygon: boomerang, edge: edge(vtx(0, 2), vtx(0, -2)), intersections: [vtx(0, 2), vtx(0, -2)] },
        { polygon: boomerang, edge: edge(vtx(0, 4), vtx(4, 4)), intersections: [vtx(2, 4), vtx(2.6, 4)] },
        { polygon: boomerang, edge: edge(vtx(4, 4), vtx(0, 4)), intersections: [vtx(2.6, 4), vtx(2, 4)] },
        { polygon: boomerang, edge: edge(vtx(-2, 1.5), vtx(4, 3)), intersections: [vtx(0, 2), vtx(2, 2.5)] },
        { polygon: boomerang, edge: edge(vtx(4, 3), vtx(-2, 1.5)), intersections: [vtx(2, 2.5), vtx(0, 2)] },
        { polygon: boomerang, edge: edge(vtx(0, 0), vtx(3, 5)), intersections: [vtx(3, 5)] },
        { polygon: boomerang, edge: edge(vtx(0, 0), vtx(6, 10)), intersections: [vtx(3, 5)] },
        { polygon: boomerang, edge: edge(vtx(0, 5), vtx(6, 5)), intersections: [vtx(3, 5)] },
        { polygon: boomerang, edge: edge(vtx(3, 0), vtx(3, 10)), intersections: [vtx(3, 5)] },
        { polygon: boomerang, edge: edge(vtx(-3, -1), vtx(4, 6)), intersections: [vtx(-2, 0), vtx(3, 5)] },
        { polygon: boomerang, edge: edge(vtx(-2, 0), vtx(3, 5)), intersections: [vtx(-2, 0), vtx(3, 5)] },
        { polygon: boomerang, edge: edge(vtx(-1, 1), vtx(2, 4)), intersections: [] },
        { polygon: boomerang, edge: edge(vtx(2, -5), vtx(2, 5)), intersections: [vtx(2, -4), vtx(2, -2.5), vtx(2, 2.5), vtx(2, 4)] },
        { polygon: boomerang, edge: edge(vtx(2, 5), vtx(2, -5)), intersections: [vtx(2, 4), vtx(2, 2.5), vtx(2, -2.5), vtx(2, -4)] },
    ];

    cases.forEach(testCase => {
        let polygon = testCase.polygon.copy(), edge = testCase.edge.copy(), intersections = testCase.intersections.slice();
        it(`should detect the intersections [${intersections}] for the polygon ${polygon} and the edge ${edge}`, () => {
            let actual = polygon.intersectEdge(edge);
            expect(actual.length).toBe(intersections.length);
            for (let i = 0; i < intersections.length; i++) {
                expect(actual[i].x).toBeCloseTo(intersections[i].x);
                expect(actual[i].y).toBeCloseTo(intersections[i].y);
            }
        })
    });

});

describe('Translate', () => {
    type TestObject = { polygon: Polygon, x: number, y: number, translated: Polygon };

    let cases: TestObject[] = [
        {polygon: poly(testVertices.square), x: 0, y: 0, translated: poly([vtx(1, 1), vtx(1, -1), vtx(-1, -1), vtx(-1, 1)])},
        {polygon: poly(testVertices.square), x: 1, y: 1, translated: poly([vtx(2, 2), vtx(2, 0), vtx(0, 0), vtx(0, 2)])},
        {polygon: poly(testVertices.square), x: -1, y: -1, translated: poly([vtx(0, 0), vtx(0, -2), vtx(-2, -2), vtx(-2, 0)])}
    ];

    let baseCase = cases[1];

    cases.forEach(testCase => {
        let polygon = testCase.polygon.copy(), x = testCase.x, y = testCase.y, translated = testCase.translated.copy();
        it(`should be ${translated} when polygon is ${polygon}, x is ${x} and y is ${y} (instance)`, () => {
            let actual = polygon.translate(x, y);
            expectPolygonEquivalency(actual, translated);
        });
    });

    cases.forEach(testCase => {
        let polygon = testCase.polygon.copy(), x = testCase.x, y = testCase.y, translated = testCase.translated.copy();
        it(`should be ${translated} when polygon is ${polygon}, x is ${x} and y is ${y} (static)`, () => {
            let actual = Polygon.translate(polygon, x, y);
            expectPolygonEquivalency(actual, translated);
        });
    });

    it('should return the translated instance when called on an object', () => {
        let p = baseCase.polygon.copy();
        let x = baseCase.x;
        let y = baseCase.y;

        let q = p.translate(x, y);
        expectPolygonEquivalency(p, q);
    });

    it('should not mutate the vertex when called statically', () => {
        let p = baseCase.polygon.copy();
        let x = baseCase.x;
        let y = baseCase.y;

        let q = Polygon.translate(p, x, y);
        expectPolygonInequality(p, q);
    });

    it('should default both coordinate arguments to 0 (instance)', () => {
        let p = baseCase.polygon.copy();
        let q = p.translate();

        expectPolygonEquivalency(q, baseCase.polygon);
    });

    it('should default both arguments to 0 (static)', () => {
        let p = baseCase.polygon.copy();
        let q = Polygon.translate(p);

        expectPolygonEquivalency(q, baseCase.polygon);
    });
});

describe('Scale', () => {
    type TestObject = { polygon: Polygon, factor: number, reference: Vertex, scaled: Polygon };

    let cases: TestObject[] = [
        {polygon: poly(testVertices.square), factor: 1, reference: null, scaled: poly([vtx(1, 1), vtx(1, -1), vtx(-1, -1), vtx(-1, 1)])},
        {polygon: poly(testVertices.square), factor: 2, reference: null, scaled: poly([vtx(2, 2), vtx(2, -2), vtx(-2, -2), vtx(-2, 2)])},
        {polygon: poly(testVertices.square), factor: 0.5, reference: null, scaled: poly([vtx(0.5, 0.5), vtx(0.5, -0.5), vtx(-0.5, -0.5), vtx(-0.5, 0.5)])},
        {polygon: poly(testVertices.square), factor: 0, reference: null, scaled: poly([vtx(0, 0), vtx(0, 0), vtx(0, 0), vtx(0, 0)])},
        {polygon: poly(testVertices.square), factor: 1, reference: vtx(1, 1), scaled: poly([vtx(1, 1), vtx(1, -1), vtx(-1, -1), vtx(-1, 1)])},
        {polygon: poly(testVertices.square), factor: 2, reference: vtx(1, 1), scaled: poly([vtx(1, 1), vtx(1, -3), vtx(-3, -3), vtx(-3, 1)])},
        {polygon: poly(testVertices.square), factor: 0.5, reference: vtx(1, 1), scaled: poly([vtx(1, 1), vtx(1, 0), vtx(0, 0), vtx(0, 1)])},
        {polygon: poly(testVertices.square), factor: 0, reference: vtx(1, 1), scaled: poly([vtx(1, 1), vtx(1, 1), vtx(1, 1), vtx(1, 1)])},
    ];
 
    let baseCase = cases[5];

    cases.forEach(testCase => {
        let polygon = testCase.polygon.copy(), factor = testCase.factor, reference = testCase.reference ? testCase.reference.copy() : null, scaled = testCase.scaled.copy();
        it(`should be ${scaled} when polygon is ${polygon}, factor is ${factor} and the reference point is ${reference ? reference : polygon.anchor} (instance)`, () => {
            let actual = polygon.scale(factor, reference);
            expectPolygonEquivalency(actual, scaled);
        });
    });

    cases.forEach(testCase => {
        let polygon = testCase.polygon.copy(), factor = testCase.factor, reference = testCase.reference ? testCase.reference.copy() : null, scaled = testCase.scaled.copy();
        it(`should be ${scaled} when polygon is ${polygon}, factor is ${factor} and the reference point is ${reference ? reference : polygon.anchor} (static)`, () => {
            let actual = Polygon.scale(polygon, factor, reference);
            expectPolygonEquivalency(actual, scaled);
        });
    });

    it('should return the scaled instance when called on an object', () => {
        let p = baseCase.polygon.copy();
        let f = baseCase.factor;
        let r = baseCase.reference.copy();

        let q = p.scale(f, r);
        expectPolygonEquivalency(p, q);
    });

    it('should not mutate the vertex when called statically', () => {
        let p = baseCase.polygon.copy();
        let f = baseCase.factor;
        let r = baseCase.reference.copy();

        let q = Polygon.scale(p, f, r);
        expectPolygonInequality(p, q);
    });

    it('should default reference point to the polygon anchor', () => {
        let p0 = baseCase.polygon.copy();
        let p1 = baseCase.polygon.copy();
        let f = baseCase.factor;

        let q0 = p0.scale(f);
        let q1 = p1.scale(f, p1.anchor);

        expectPolygonEquivalency(q0, q1);
    });

    it('should default both arguments to 0 (static)', () => {
        let p = baseCase.polygon.copy();
        let f = baseCase.factor;

        let q0 = Polygon.scale(p, f);
        let q1 = Polygon.scale(p, f, p.anchor);

        expectPolygonEquivalency(q0, q1);
    });
});

describe('Rotate', () => {
    type TestObject = { polygon: Polygon, angle: number, reference: Vertex, rotated: Polygon };

    let cases: TestObject[] = [
        {polygon: poly(testVertices.square), angle: 0, reference: null, rotated: poly([vtx(1, 1), vtx(1, -1), vtx(-1, -1), vtx(-1, 1)])},
        {polygon: poly(testVertices.square), angle: 2*Math.PI, reference: null, rotated: poly([vtx(1, 1), vtx(1, -1), vtx(-1, -1), vtx(-1, 1)])},
        {polygon: poly(testVertices.square), angle: Math.PI / 2, reference: null, rotated: poly([vtx(-1, 1), vtx(1, 1), vtx(1, -1), vtx(-1, -1)])},
        {polygon: poly(testVertices.square), angle: -Math.PI / 2, reference: null, rotated: poly([vtx(1, -1), vtx(-1, -1), vtx(-1, 1), vtx(1, 1)])},
        {polygon: poly(testVertices.square), angle: 0, reference: vtx(1, 1), rotated: poly([vtx(1, 1), vtx(1, -1), vtx(-1, -1), vtx(-1, 1)])},
        {polygon: poly(testVertices.square), angle: 2*Math.PI, reference: vtx(1, 1), rotated: poly([vtx(1, 1), vtx(1, -1), vtx(-1, -1), vtx(-1, 1)])},
        {polygon: poly(testVertices.square), angle: Math.PI / 2, reference: vtx(1, 1), rotated: poly([vtx(1, 1), vtx(3, 1), vtx(3, -1), vtx(1, -1)])},
        {polygon: poly(testVertices.square), angle: -Math.PI / 2, reference: vtx(1, 1), rotated: poly([vtx(1, 1), vtx(-1, 1), vtx(-1, 3), vtx(1, 3)])},
    ];
 
    let baseCase = cases[5];

    cases.forEach(testCase => {
        let polygon = testCase.polygon.copy(), angle = testCase.angle, reference = testCase.reference ? testCase.reference.copy() : null, rotated = testCase.rotated.copy();
        it(`should be ${rotated} when polygon is ${polygon}, angle is ${angle} and the reference point is ${reference ? reference : polygon.anchor} (instance)`, () => {
            let actual = polygon.rotate(angle, reference);
            expectPolygonEquivalency(actual, rotated);
        });
    });

    cases.forEach(testCase => {
        let polygon = testCase.polygon.copy(), angle = testCase.angle, reference = testCase.reference ? testCase.reference.copy() : null, rotated = testCase.rotated.copy();
        it(`should be ${rotated} when polygon is ${polygon}, angle is ${angle} and the reference point is ${reference ? reference : polygon.anchor} (static)`, () => {
            let actual = Polygon.rotate(polygon, angle, reference);
            expectPolygonEquivalency(actual, rotated);
        });
    });

    it('should return the scaled instance when called on an object', () => {
        let p = baseCase.polygon.copy();
        let a = baseCase.angle;
        let r = baseCase.reference.copy();

        let q = p.rotate(a, r);
        expectPolygonEquivalency(p, q);
    });

    it('should not mutate the vertex when called statically', () => {
        let p = baseCase.polygon.copy();
        let a = baseCase.angle;
        let r = baseCase.reference.copy();

        let q = Polygon.rotate(p, a, r);
        expectPolygonInequality(p, q);
    });

    it('should default reference point to the polygon anchor', () => {
        let p0 = baseCase.polygon.copy();
        let p1 = baseCase.polygon.copy();
        let a = baseCase.angle;

        let q0 = p0.rotate(a);
        let q1 = p1.rotate(a, p1.anchor);

        expectPolygonEquivalency(q0, q1);
    });

    it('should default both arguments to 0 (static)', () => {
        let p = baseCase.polygon.copy();
        let a = baseCase.angle;

        let q0 = Polygon.rotate(p, a);
        let q1 = Polygon.rotate(p, a, p.anchor);

        expectPolygonEquivalency(q0, q1);
    });
});

describe('Reflect', () => {
    type TestObject = { polygon: Polygon, axis: Vector, reference: Vertex, reflected: Polygon };

    let cases: TestObject[] = [
        {polygon: poly(testVertices.square), axis: vec(0, 0), reference: null, reflected: poly([vtx(1, 1), vtx(1, -1), vtx(-1, -1), vtx(-1, 1)])},
        {polygon: poly(testVertices.square), axis: vec(1, 0), reference: null, reflected: poly([vtx(1, -1), vtx(1, 1), vtx(-1, 1), vtx(-1, -1)])},
        {polygon: poly(testVertices.square), axis: vec(0, 1), reference: null, reflected: poly([vtx(-1, 1), vtx(-1, -1), vtx(1, -1), vtx(1, 1) ])},
        {polygon: poly(testVertices.square), axis: vec(1, 1), reference: null, reflected: poly([vtx(1, 1), vtx(-1, 1), vtx(-1, -1), vtx(1, -1)])},
        {polygon: poly(testVertices.square), axis: vec(-1, 1), reference: null, reflected: poly([vtx(-1, -1), vtx(1, -1), vtx(1, 1), vtx(-1, 1)])},
        {polygon: poly(testVertices.square), axis: vec(0, 0), reference: vtx(1, 1), reflected: poly([vtx(1, 1), vtx(1, -1), vtx(-1, -1), vtx(-1, 1)])},
        {polygon: poly(testVertices.square), axis: vec(1, 0), reference: vtx(1, 1), reflected: poly([vtx(1, 1), vtx(1, 3), vtx(-1, 3), vtx(-1, 1)])},
        {polygon: poly(testVertices.square), axis: vec(0, 1), reference: vtx(1, 1), reflected: poly([vtx(1, 1), vtx(1, -1), vtx(3, -1), vtx(3, 1)])},
        {polygon: poly(testVertices.square), axis: vec(1, 1), reference: vtx(1, 1), reflected: poly([vtx(1, 1), vtx(-1, 1), vtx(-1, -1), vtx(1, -1)])},
        {polygon: poly(testVertices.square), axis: vec(-1, 1), reference: vtx(1, 1), reflected: poly([vtx(1, 1), vtx(3, 1), vtx(3, 3), vtx(1, 3)])},
    ];
 
    let baseCase = cases[6];

    cases.forEach(testCase => {
        let polygon = testCase.polygon.copy(), axis = testCase.axis.copy(), reference = testCase.reference ? testCase.reference.copy() : null, reflected = testCase.reflected.copy();
        it(`should be ${reflected} when polygon is ${polygon}, reflection axis is ${axis} and the reference point is ${reference ? reference : polygon.anchor} (instance)`, () => {
            let actual = polygon.reflect(axis, reference);
            expectPolygonEquivalency(actual, reflected);
        });
    });

    cases.forEach(testCase => {
        let polygon = testCase.polygon.copy(), axis = testCase.axis.copy(), reference = testCase.reference ? testCase.reference.copy() : null, reflected = testCase.reflected.copy();
        it(`should be ${reflected} when polygon is ${polygon}, reflection axis is ${axis} and the reference point is ${reference ? reference : polygon.anchor} (static)`, () => {
            let actual = Polygon.reflect(polygon, axis, reference);
            expectPolygonEquivalency(actual, reflected);
        });
    });

    it('should return the scaled instance when called on an object', () => {
        let p = baseCase.polygon.copy();
        let a = baseCase.axis.copy();
        let r = baseCase.reference.copy();

        let q = p.reflect(a, r);
        expectPolygonEquivalency(p, q);
    });

    it('should not mutate the vertex when called statically', () => {
        let p = baseCase.polygon.copy();
        let a = baseCase.axis.copy();
        let r = baseCase.reference.copy();

        let q = Polygon.reflect(p, a, r);
        expectPolygonInequality(p, q);
    });

    it('should default reference point to the polygon anchor', () => {
        let p0 = baseCase.polygon.copy();
        let p1 = baseCase.polygon.copy();
        let a = baseCase.axis.copy();

        let q0 = p0.reflect(a);
        let q1 = p1.reflect(a, p1.anchor);

        expectPolygonEquivalency(q0, q1);
    });

    it('should default both arguments to 0 (static)', () => {
        let p = baseCase.polygon.copy();
        let a = baseCase.axis.copy();

        let q0 = Polygon.reflect(p, a);
        let q1 = Polygon.reflect(p, a, p.anchor);

        expectPolygonEquivalency(q0, q1);
    });
});

describe('Overlap Split', () => {
    type TestObject = { polygon: Polygon, split: Polygon[] };

    let cases: TestObject[] = [
        {polygon: poly(testVertices.square), split: [poly(testVertices.square)]},
        {polygon: poly(testVertices.kissingTriangles), split: [poly([vtx(1, 1), vtx(1, -1), vtx(0, 0)]), poly([vtx(-1, 1), vtx(-1, -1), vtx(0, 0)])]},
        {polygon: poly(testVertices.twisted), split: [poly([vtx(0, 1), vtx(0, 0), vtx(1, 0), vtx(1, 1)]), poly([vtx(0, -1), vtx(-1, 0), vtx(0, 0)]), poly([vtx(1, 2), vtx(2, 1), vtx(1, 1)])]}
    ];

    cases.forEach(testCase => {
        let polygon = testCase.polygon.copy(), split = testCase.split.slice();
        it(`should be ${split} when polygon is ${polygon}`, () => {
            let actual = polygon.overlapSplit();
            expect(actual.length).toBe(split.length);
            for (let i = 0; i < actual.length; i++) {
                expectPolygonEquivalency(actual[i], split[i]);
            }
        });
    });
});


describe('Offset', () => {
    type TestObject = { polygon: Polygon, quantity: number, offsetSegments: Polygon[] };

    let cases: TestObject[] = [
        {polygon: poly(testVertices.square), quantity: -1, offsetSegments: []},
        {polygon: poly(testVertices.square), quantity: -0.5, offsetSegments: [poly([vtx(0.5, -0.5), vtx(-0.5, -0.5), vtx(-0.5, 0.5), vtx(0.5, 0.5)])]},
        {polygon: poly(testVertices.square), quantity: 0, offsetSegments: [poly(testVertices.square)]},
        {polygon: poly(testVertices.square), quantity: 1.0, offsetSegments: [poly([vtx(2, 1), vtx(2, -1), vtx(1, -2), vtx(-1, -2), vtx(-2, -1), vtx(-2, 1), vtx(-1, 2), vtx(1, 2)])]}
    ];

    cases.forEach(testCase => {
        let polygon = testCase.polygon.copy(), quantity = testCase.quantity, offsetSegments = testCase.offsetSegments.slice();
        it(`should be ${offsetSegments} when polygon is ${polygon} and the offset quantity is ${quantity}`, () => {
            let actual = polygon.offset(quantity);
            expect(actual.length).toBe(offsetSegments.length);
            for (let i = 0; i < actual.length; i++) {
                expectPolygonEquivalency(actual[i], offsetSegments[i]);
            }
        });
    });
});