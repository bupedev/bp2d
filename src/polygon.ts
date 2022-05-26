import { edge, Edge } from "./edge"
import { Vector } from "./vector"
import { Vertex } from "./vertex";

/**
 * A polygon in two dimensional space.
 */
export class Polygon {
    private _vertices: Vertex[];
    private _edges: Edge[];
    private _clockwise: boolean;

    /**
     * A copy of the collection of vertices that constitute the boundary of the polygon.
     */
    public get vertices(): Vertex[] {
        return this._vertices.map((vertex) => vertex.copy());
    };

    /**
     * A copy of the collection of edges that constitute the boundary of the polygon.
     */
    public get edges(): Edge[] {
        return this._edges.map((edge) => edge.copy());
    };

    /**
     * True if the polygon edges are oriented in a clockwise direction, false otherwise.
     */
    public get clockwise(): boolean {
        return this._clockwise;
    };

    /**
     * The anchoring point of the polygon; the point from which all transformative operations will be completed in 
     * reference to. The anchor point will be the centroid of the polygon by default.
     */
    public anchor: Vertex;

    /**
     * Constructs the polygon edges and orientation from an array of vertices expressed as polygons.
     * @param vertices 
     */
    constructor(vertices: Vertex[]) {
        this._vertices = vertices.slice();
        this._edges = Polygon.calculateEdges(this._vertices);
        this._clockwise = Polygon.calculateAngularSum(this._edges) < 0;
        this.anchor = Vertex.mean(vertices);
    }

    private static calculateEdges(vertices: Vertex[]): Edge[] {
        let edges: Edge[] = [];
        for (let i = 0; i + 1 < vertices.length; i++) {
            edges.push(edge(vertices[i], vertices[i + 1]));
        }
        edges.push(edge(vertices[vertices.length - 1], vertices[0]));
        return edges;
    }

    private static calculateAngularSum(edges: Edge[]): number {
        let sum = 0;
        let priorHeading = edges[edges.length - 1].direction().angle();
        for (let i = 0; i < edges.length; i++) {
            sum += edges[i].start.angleTo(edges[i].end, priorHeading);
            priorHeading = edges[i].direction().angle();
        }
        return sum;
    }

    /**
     * Constructs a new Polygon object with the same properties of this one.
     * @returns A new Polygon object.
     */
    public copy(): Polygon {
        let copyPolygon = poly(this.vertices);
        copyPolygon.anchor = this.anchor;
        return copyPolygon;
    }

    /**
     * Creates a user-friendly formatted string for the polygon. Vertices are contained in parenthesis, separated by 
     * commas and formatted as user-friendly vertices.
     * @returns A formatted string representing the polygon.
     */
    public toString(): string {
        return `(${this._vertices.join(", ")})`;
    }

    /**
     * Calculates all distinct intersecting points between the edges of this polygon and another edge.
     * @param edge The edge to intersect with the edges of this polygon.
     * @returns All distinct intersecting points in an array.
     */
    public intersectEdge(edge: Edge): Vertex[] {
        let vertices: Vertex[] = [];

        this.edges.forEach(polygonEdge => {
            let intersection = polygonEdge.intersectEdge(edge);
            if (intersection) {
                vertices.push(intersection);
            }
        });

        vertices.sort((a, b) => {
            return a.distanceTo(edge.start) - b.distanceTo(edge.start)
        });

        return vertices.filter((vertex, index, array) => {
            return !index || !vertex.isEquivalentTo(array[index - 1]);
        });
    }

    /**
     * Translates the polygon by some amount along both axes.
     * @param x The translation along the x-axis, 0 by default.
     * @param y The translation along the y-axis, 0 by default.
     * @returns The polygon after translation.
     */
    public translate(x: number = 0, y: number = 0): Polygon {
        return this.transform(vertex => vertex.translate(x, y));
    }

    /**
     * Translates a polygon by some amount along both axes.
     * @param polygon The polygon to translate.
     * @param x The translation along the x-axis, 0 by default.
     * @param y The translation along the y-axis, 0 by default.
     * @returns The new translated polygon.
     */
    public static translate(polygon: Polygon, x: number = 0, y: number = 0): Polygon {
        return polygon.copy().translate(x, y);
    }

    /**
     * Scales the distance between the vertices of the polygon and some reference point.
     * @param factor The scaling factor.
     * @param reference The point from which to scale the polygon vertices, the polygon anchor point by default.
     * @returns The polygon after scaling.
     */
    public scale(factor: number, reference: Vertex = null): Polygon {
        return this.transform(vertex => vertex.scale(factor, reference ? reference : this.anchor));
    }

    /**
     * Scales the distance between the vertices of a polygon and some control point.
     * @param polygon The polygon to scale.
     * @param factor The scaling factor.
     * @param reference The point from which to scale the polygon vertices, the polygon anchor point by default.
     * @returns A new scaled polygon.
     */
    public static scale(polygon: Polygon, factor: number, reference: Vertex = null): Polygon {
        return polygon.copy().scale(factor, reference);
    }

    /**
     * Rotates the polygon around some reference point.
     * @param angle The amount to rotate the polygon by in radians.
     * @param reference The point from which to rotate the polygon, the polygon anchor point by default.
     * @returns The polygon after rotation.
     */
    public rotate(angle: number, reference: Vertex = null): Polygon {
        return this.transform(vertex => vertex.rotate(angle, reference ? reference : this.anchor));
    }

    /**
     * Rotates a polygon around some reference point.
     * @param polygon The polygon to rotate
     * @param angle The amount to rotate the polygon by in radians.
     * @param reference The point from which to rotate the polygon, the polygon anchor point by default. 
     * @returns A new rotated polygon.
     */
    public static rotate(polygon: Polygon, angle: number, reference: Vertex = null): Polygon {
        return polygon.copy().rotate(angle, reference);
    }

    /**
     * Reflects the polygon along an axis projected from some reference point.
     * @param axis The axis along which to reflect the polygon.
     * @param reference The point from which to project the axis for reflection, the polygon anchor point by default.
     * @returns The polygon after reflection. 
     */
    public reflect(axis: Vector, reference: Vertex = null): Polygon {
        return this.transform(vertex => vertex.reflect(axis, reference ? reference : this.anchor));
    }

    /**
     * Reflects a polygon along an axis projected from some reference point.
     * @param polygon The polygon to reflect.
     * @param axis The axis along which to reflect the polygon.
     * @param reference The point from which to project the axis for reflection, the polygon anchor point by default.
     * @returns A new reflected polygon.
     */
    public static reflect(polygon: Polygon, axis: Vector, reference: Vertex = null): Polygon {
        return polygon.copy().reflect(axis, reference);
    }

    private transform(transformation: (vertex: Vertex) => void): Polygon {
        this._vertices.forEach(vertex => {
            transformation(vertex);
        });
        this._edges = Polygon.calculateEdges(this._vertices);
        this._clockwise = Polygon.calculateAngularSum(this._edges) < 0;
        return this;
    }

    /**
     * Splits the existing polygon into one or more sub-polygons based on it's self-intersecting edges.
     * @returns An array of polygons derived from this one.
     */
    public overlapSplit(): Polygon[] {
        let resolved = [false];
        let subPolygons = [this.copy()];

        while (!resolved.every(p => p)) {
            let restart = false;
            for (let p = 0; p < subPolygons.length; p++) {
                let polygon = subPolygons[p];
                let edgeCount = polygon._edges.length;
                for (let i = 0; i < edgeCount; i++) {
                    let base = polygon._edges[i];
                    let subIndices = [];
                    for (let j = i + 1; j < i + edgeCount; j++) {
                        let tj = mod(j, edgeCount);
                        subIndices.push(tj);
                        let target = polygon._edges[tj];
                        let intersection = base.intersectEdge(target);
                        if (intersection && !(intersection.isEquivalentTo(base.end) || intersection.isEquivalentTo(base.start))) {
                            let modifiedVertices = polygon._vertices.filter((vertex, index) => !subIndices.includes(index));
                            modifiedVertices.splice(i + 1, 0, intersection);
                            subPolygons[p] = poly(modifiedVertices);

                            let createdVertices = polygon._vertices.filter((vertex, index) => subIndices.includes(index));
                            createdVertices.push(intersection);
                            subPolygons.push(poly(createdVertices));
                            resolved.push(false);

                            restart = true;
                            break;
                        }
                    }

                    if (restart) {
                        break;
                    }
                }

                if (restart) {
                    break;
                }

                resolved[p] = true;
            }
        }

        return subPolygons;
    }

    /**
     * Offests the edges of the polygon orthogonally by some quantity.  Depending on the structure of the polygon and the offset 
     * amount it is entirely for the polygon to be separated into two or more distinct polygons.
     * @param quantity The amount to offset the polygon edges. A positive value will shift the polygon edges away from the 
     *                 centre, while a negative value will shift the polygon edges toward the centre.
     * @returns An array of offset polygon segments.
     */
    public offset(quantity: number): Polygon[] {
        if (quantity === 0) {
            return [this.copy()];
        }

        let rawOffsetVertices: Vertex[] = []
        this._edges.forEach(edge => {
            let offset = edge.normal(this.clockwise).scale(quantity);
            rawOffsetVertices.push(Vertex.translate(edge.start, offset.x, offset.y));
            rawOffsetVertices.push(Vertex.translate(edge.end, offset.x, offset.y));
        });
        let splitSegments = poly(rawOffsetVertices).overlapSplit();
        return splitSegments.filter((segment) => segment.clockwise == this.clockwise);
    }
}

// Put this in a common place, I don't think this is the only time it will be desired...
function mod(x: number, m: number): number {
    return ((x % m) + m) % m;
}

export function poly(vertices: Vertex[]): Polygon {
    return new Polygon(vertices);
}