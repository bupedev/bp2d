import { line, Line } from "./line"
import { Vector, vec } from "./vector"
import { Vertex, vtx } from "./vertex";
import { mod } from "./../utility/numerics"

/**
 * A polygon in two dimensional space.
 */
export class Polygon {
    private _vertices: Vertex[];
    private _edges: Line[];
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
    public get edges(): Line[] {
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
        if (vertices.length == 0) {
            return processed;
        }

        for (let i = 0; i + 1 < vertices.length; i++) {
            if (vertices[i].isEquivalentTo(vertices[i + 1])) {
                continue;
            }
            else {
                processed.push(vertices[i].copy())
            }
        }

        if (!vertices[vertices.length - 1].isEquivalentTo(vertices[0])) {
            processed.push(vertices[vertices.length - 1].copy());
        }

        if (processed.length == 0 && vertices.length > 0) {
            processed.push(vertices[0].copy());
        }

        return processed;
    }

    private static calculateEdges(vertices: Vertex[]): Line[] {
        let edges: Line[] = [];

        if (vertices.length < 2) {
            return edges;
        }

        for (let i = 0; i + 1 < vertices.length; i++) {
            edges.push(line(vertices[i], vertices[i + 1]));
        }

        edges.push(line(vertices[vertices.length - 1], vertices[0]));

        return edges;
    }

    private static calculateAngularSum(edges: Line[]): number {
        let sum = 0;

        if (edges.length < 1) {
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
        for (let i = 0; i < N; i++) {
            let v0 = vertices[mod(i, vertices.length)];
            let v1 = vertices[mod(i + 1, N)];
            A += (v0.x * v1.y - v0.y * v1.x);
        }
        A *= 0.5;

        let Cx = 0;
        let Cy = 0;
        for (let i = 0; i < N; i++) {
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
     * Calculates all distinct intersecting points between the edges of this polygon and a line.
     * @param line The line to intersect with the edges of this polygon.
     * @returns All distinct intersecting points in an array.
     */
    public intersectLine(line: Line): Vertex[] {
        let vertices: Vertex[] = [];

        this.edges.forEach(edge => {
            let intersection = edge.intersectLine(line);
            if (intersection) {
                vertices.push(intersection);
            }
        });

        vertices.sort((a, b) => {
            return a.distanceTo(line.start) - b.distanceTo(line.start)
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
                        let intersection = base.intersectLine(target);
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
     * Creates a polygon from a collection of unordered edges. This method operates under the assumption that each edge is 
     * connected to two other edges in the collection with no particular ordering or direction.
     * @param edges The collection of unordered edges. 
     * @returns A polygon created by sorting the vertices of the unordered edges.
     */
    public static fromUnorderedEdges(edges: Line[]): Polygon {
        let vertices = [edges[0].start];
        let useEnd = true;
        let targetIndex = 0;
        let bannedIndices = [];
        let edgeCount = edges.length;
        while (vertices.length < edgeCount) {
            bannedIndices.push(targetIndex);
            let target = edges[targetIndex];
            let next = useEnd ? target.end : target.start;
            for (let potentialIndex = 0; potentialIndex < edges.length; potentialIndex++) {
                if (bannedIndices.includes(potentialIndex) || potentialIndex == targetIndex) continue;
                let potential = edges[potentialIndex];
                if (next.isEquivalentTo(potential.start)) {
                    bannedIndices.push(potentialIndex);
                    targetIndex = potentialIndex;
                    vertices.push(potential.start);
                    useEnd = true;
                    break;
                }
                if (next.isEquivalentTo(potential.end)) {
                    bannedIndices.push(potentialIndex);
                    targetIndex = potentialIndex;
                    vertices.push(potential.end);
                    useEnd = false;
                    break;
                }
            }
        }
        return poly(vertices);
    }

    /**
     * Generates hatching lines within the bounds of the polygon with specified angle and spacing configuration.
     * @param angle The angle of the hatch lines within the polygon.
     * @param spacing The desired spacing between hatch lines.
     * @param jitter A function that generates jitter for each hatch line, this function must accept values between 0 and 1 and 
     *               map them to values -1 and 1.
     * @param randomizer A randomization function to use as the input for the jitter function that returns values between 0 and 1.
     * @returns An array of line representing the hatch lines within the polygon
     */
    public hatchFill(angle: number, spacing: number, jitter: (x: number) => number, randomizer: () => number): Line[] {
        let maxAnchorDistance = this.getMaxAnchorDistance();
        let steps = Math.floor(maxAnchorDistance / spacing);
        let grain = Vector.unit(angle);
        let ortho = grain.copy().rotate(Math.PI / 2);
        let candidates = [];
        for (let offset = -steps; offset <= steps; offset++) {
            let lineShift = Vector.scale(ortho, spacing * (offset + jitter(randomizer())));
            let control = this.anchor.toVector().add(lineShift);
            candidates.push(
                line(
                    Vector.add(control, Vector.scale(grain, -maxAnchorDistance * 2)).toVertex(),
                    Vector.add(control, Vector.scale(grain, +maxAnchorDistance * 2)).toVertex()));
        }

        let hatchLines = [];
        candidates.forEach(candidate => {
            let intersections = this.intersectLine(candidate);
            for (let i = 0; i < intersections.length - 1; i += 2) {
                hatchLines.push(line(intersections[i], intersections[i + 1]));
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

    /**
     * Creates a regular polygon with a specified number of edges.
     * @param order The number of edges for the polygon
     * @param centre The centre of the polygon. If left undefined, the centre will default to the origin.
     * @param scale The distance from the centre of the polygon to each of the vertices. If left undefined, the scale will be 1.0.
     * @param rotation The rotation of the polygon around it's centre measured in radians. The first polygon vertex will lie on (1, 0) unless rotated. If left undefined, the rotation will be 0.0.
     * @returns A regular (equal edge sizes and angles) polygon
     */
    public static createRegular(order: number, centre: Vertex | undefined = undefined, scale: number | undefined = undefined, rotation: number | undefined = undefined): Polygon {
        let vertices: Vertex[] = [];

        if (!centre) {
            centre = vtx(0, 0);
        }

        if (!scale) {
            scale = 1.0;
        }

        if (!rotation) {
            rotation = 0.0;
        }

        let vertexVector = vec(1, 0).scale(scale).rotate(rotation);
        let segmentRotation = 2 * Math.PI / order;
        for (let i = 0; i < order; i++) {
            vertices.push(Vertex.displace(centre, vertexVector));
            vertexVector.rotate(segmentRotation);
        }
        return poly(vertices);
    }

    /**
     * Determines whether a particular polygon vertex is concave or not.
     * @param vertexIndex The index of the vertex of which to assess covexity.
     * @returns True if the vertex is convex, false if it is concave.
     */
    public isVertexConvex(vertexIndex: number): boolean {
        let coming = this._edges[mod(vertexIndex - 1, this._edges.length)].direction();
        let going = this._edges[mod(vertexIndex, this._edges.length)].direction();
        return (!this._clockwise || coming.angleBetween(going) > Math.PI) && (this._clockwise || coming.angleBetween(going) < Math.PI);
    }

    /**
     * Calculates the vector normal to the internal structure of the polygon at a specified vertex.
     * @param vertexIndex The index of the vertex for which to calculate the normal.
     * @returns The vector normal to the internal structure of the polygon at a specified vertex.
     */
    public vertexNormal(vertexIndex: number): Vector {
        let startNormal = this.edgeNormal(vertexIndex - 1);
        let endNormal = this.edgeNormal(vertexIndex);
        let angleBetween;

        if (this._clockwise) {
            if (this.isVertexConvex(vertexIndex)) {
                angleBetween = endNormal.angleBetween(startNormal);
                return Vector.unit(endNormal.angle() + angleBetween / 2);
            } else {
                angleBetween = startNormal.angleBetween(endNormal);
                return Vector.unit(endNormal.angle() - angleBetween / 2);
            }
        }
        else {
            if (this.isVertexConvex(vertexIndex)) {
                angleBetween = startNormal.angleBetween(endNormal);
                return Vector.unit(startNormal.angle() + angleBetween / 2);
            } else {
                angleBetween = endNormal.angleBetween(startNormal);
                return Vector.unit(startNormal.angle() - angleBetween / 2);
            }
        }
    }

    /**
     * Calculates the vector normal to the internal structure of the polygon at a specified edge.
     * @param edgeIndex The index of the edge for which to calculate the normal.
     * @returns The vector normal to the internal structure of the polygon at a specified edge.
     */
    public edgeNormal(edgeIndex: number): Vector {
        let edge = this._edges[mod(edgeIndex, this._edges.length)];
        return edge.normal(this._clockwise);
    }
}

export function poly(vertices: Vertex[]): Polygon {
    return new Polygon(vertices);
}