import { edge, Edge } from "./edge"
import { Vector } from "./vector"
import { Vertex, vtx } from "./vertex";
import { mod } from "./../utility/numerics"

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
        this._vertices = Polygon.processVertices(vertices);
        this._edges = Polygon.calculateEdges(this._vertices);
        this._clockwise = Polygon.calculateAngularSum(this._edges) < 0;
        this.anchor = Polygon.calculateVertexCentroid(this._vertices);
    }

    private static processVertices(vertices: Vertex[]): Vertex[] {
        let processed = [];
        if(vertices.length == 0) {
            return processed;
        }
        
        for(let i = 0; i + 1 < vertices.length; i++) {
            if(vertices[i].isEquivalentTo(vertices[i+1])) {
                continue;
            }
            else {
                processed.push(vertices[i].copy())
            }
        }

        if(!vertices[vertices.length - 1].isEquivalentTo(vertices[0])){
            processed.push(vertices[vertices.length - 1].copy());
        }

        if(processed.length == 0 && vertices.length > 0) {
            processed.push(vertices[0].copy());
        }

        return processed;
    }

    private static calculateEdges(vertices: Vertex[]): Edge[] {
        let edges: Edge[] = [];

        if(vertices.length < 2) {
            return edges;    
        }

        for (let i = 0; i + 1 < vertices.length; i++) {
            edges.push(edge(vertices[i], vertices[i + 1]));
        }

        edges.push(edge(vertices[vertices.length - 1], vertices[0]));
        
        return edges;
    }

    private static calculateAngularSum(edges: Edge[]): number {
        let sum = 0;

        if(edges.length < 1) {
            return sum;
        }

        let priorHeading = edges[edges.length - 1].direction().angle();
        for (let i = 0; i < edges.length; i++) {
            sum += edges[i].start.angleTo(edges[i].end, priorHeading);
            priorHeading = edges[i].direction().angle();
        }
        return sum;
    }

    private static calculateVertexCentroid(vertices: Vertex[]): Vertex {
        let N = vertices.length;
        switch (N) {
            case 0:
                return vtx(0, 0);       
            case 1:
                return vertices[0];
        }

        let A = 0;
        for(let i = 0; i < N; i++) {
            let v0 = vertices[mod(i, vertices.length)];
            let v1 = vertices[mod(i + 1, N)];
            A += (v0.x * v1.y - v0.y * v1.x);
        }
        A *= 0.5;

        let Cx = 0;
        let Cy = 0;
        for(let i = 0; i < N; i++) {
            let v0 = vertices[mod(i, vertices.length)];
            let v1 = vertices[mod(i + 1, N)];
            Cx += (v0.x + v1.x) * (v0.x * v1.y - v0.y * v1.x);
            Cy += (v0.y + v1.y) * (v0.x * v1.y - v0.y * v1.x);
        }
        Cx /= 6 * A
        Cy /= 6 * A

        return vtx(Cx, Cy);
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
    public scale(factor: number, reference: Vertex | undefined = undefined): Polygon {
        return this.transform(vertex => vertex.scale(factor, reference ? reference : this.anchor));
    }

    /**
     * Scales the distance between the vertices of a polygon and some control point.
     * @param polygon The polygon to scale.
     * @param factor The scaling factor.
     * @param reference The point from which to scale the polygon vertices, the polygon anchor point by default.
     * @returns A new scaled polygon.
     */
    public static scale(polygon: Polygon, factor: number, reference: Vertex | undefined = undefined): Polygon {
        return polygon.copy().scale(factor, reference);
    }

    /**
     * Rotates the polygon around some reference point.
     * @param angle The amount to rotate the polygon by in radians.
     * @param reference The point from which to rotate the polygon, the polygon anchor point by default.
     * @returns The polygon after rotation.
     */
    public rotate(angle: number, reference: Vertex | undefined = undefined): Polygon {
        return this.transform(vertex => vertex.rotate(angle, reference ? reference : this.anchor));
    }

    /**
     * Rotates a polygon around some reference point.
     * @param polygon The polygon to rotate
     * @param angle The amount to rotate the polygon by in radians.
     * @param reference The point from which to rotate the polygon, the polygon anchor point by default. 
     * @returns A new rotated polygon.
     */
    public static rotate(polygon: Polygon, angle: number, reference: Vertex | undefined = undefined): Polygon {
        return polygon.copy().rotate(angle, reference);
    }

    /**
     * Reflects the polygon along an axis projected from some reference point.
     * @param axis The axis along which to reflect the polygon.
     * @param reference The point from which to project the axis for reflection, the polygon anchor point by default.
     * @returns The polygon after reflection. 
     */
    public reflect(axis: Vector, reference: Vertex | undefined = undefined): Polygon {
        return this.transform(vertex => vertex.reflect(axis, reference ? reference : this.anchor));
    }

    /**
     * Reflects a polygon along an axis projected from some reference point.
     * @param polygon The polygon to reflect.
     * @param axis The axis along which to reflect the polygon.
     * @param reference The point from which to project the axis for reflection, the polygon anchor point by default.
     * @returns A new reflected polygon.
     */
    public static reflect(polygon: Polygon, axis: Vector, reference: Vertex | undefined = undefined): Polygon {
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
                            let modifiedVertices = polygon._vertices.filter((_, index) => !subIndices.includes(index));
                            modifiedVertices.splice(i + 1, 0, intersection);
                            subPolygons[p] = poly(modifiedVertices);

                            let createdVertices = polygon._vertices.filter((_, index) => subIndices.includes(index));
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
     * Offsets the edges of the polygon orthogonally by some quantity.  Depending on the structure of the polygon and the offset 
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

    /**
     * Generates hatching lines within the bounds of the polygon with specified angle and spacing configuration.
     * @param angle The angle of the hatch lines within the polygon.
     * @param spacing The desired spacing between hatch lines.
     * @param jitter A function that generates jitter for each hatch line, this function must accept values between 0 and 1 and 
     *               map them to values -1 and 1.
     * @param randomizer A randomization function to use as the input for the jitter function that returns values between 0 and 1.
     * @returns An array of edges representing the hatch lines within the polygon
     */
    public hatchFill(angle: number, spacing: number, jitter: (x: number) => number, randomizer: () => number): Edge[] {
        let maxAnchorDistance = this.getMaxAnchorDistance();
        let steps = Math.floor(maxAnchorDistance / spacing); 
        let grain = Vector.unit(angle);
        let ortho = grain.copy().rotate(Math.PI/2);
        let candidates = []; 
        for(let offset = -steps; offset <= steps; offset++) {
            let edgeShift = Vector.scale(ortho, spacing * (offset + jitter(randomizer())));
            let control = this.anchor.toVector().add(edgeShift);
            candidates.push(
                edge(
                    Vector.add(control, Vector.scale(grain, -maxAnchorDistance * 2)).toVertex(), 
                    Vector.add(control, Vector.scale(grain, +maxAnchorDistance * 2)).toVertex()));
        }

        let hatchLines = [];
        candidates.forEach(candidate => {
            let intersections = this.intersectEdge(candidate);
            for (let i = 0; i < intersections.length - 1; i += 2) {
                hatchLines.push(edge(intersections[i], intersections[i + 1]));
            }
        });

        return hatchLines;
    }

    private getMaxAnchorDistance(): number {
        let maxDistance = 0;
        this._vertices.forEach(vertex => {
            let distance = this.anchor.distanceTo(vertex);
            if (distance > maxDistance) maxDistance = distance;
        });
        return maxDistance;
    }
}

export function poly(vertices: Vertex[]): Polygon {
    return new Polygon(vertices);
}