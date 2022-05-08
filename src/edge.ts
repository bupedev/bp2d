import { Vector } from './vector'

/**
 * A polygonal edge in 2-dimensional space, effectively a line segment.
 */
export class Edge {
    /**
     * A vector representing the starting vertex of the edge.
     */
    public start: Vector;

    /**
     * A vector representing the ending vertex of the edge.
     */
    public end: Vector;

    /**
     * Constructs an edge with specified starting and ending vertices.
     * @param start A vector representing the starting vertex of the edge.
     * @param end A vector representing the ending vertex of the edge.
     */
    constructor(start: Vector, end: Vector) {
        this.start = start;
        this.end = end;
    }

    /**
     * Creates a new Edge object with the same properties of this one.
     * @returns A new Edge object.
     */
    public copy(): Edge {
        return edge(this.start.copy(), this.end.copy());
    }

    /**
     * Creates a user-friendly formatted string for the edge. Elements are contained in parenthesis, separated by 
     * commas and formatted as user-friendly vectors.
     * @returns A formatted string representing the edge.
     */
    public toString(): string {
        return `(${this.start}, ${this.end})`;
    }

    /**
     * Creates a displacement vector between the start and end of the edge.
     * @param reverse Creates a displacement vector in the opposite direction if true.
     * @returns A displacement vector.
     */
    public direction(reverse: boolean = false): Vector {
        return Vector.subtract(this.end, this.start).scale(reverse ? -1 : 1);
    }

    /**
     * Creates a vector normal to the edge. The method operates under the assumption that the edge is part of a CCW polygon.
     * @param clockwise Creates a normal vector in the opposite direction.
     * @returns A normal vector.
     */
    public normal(clockwise: boolean = false): Vector {
        return this.direction(clockwise).normalize().rotate(-Math.PI/2);
    }

    /**
     * Calculates the length of the edge.
     * @returns The length of the edge.
     */
    public length(): number {
        return this.direction().magnitude();
    }

    /**
     * Determines whether some number is within a range defined by two bounding numbers.
     * @param target The number to check the range for.
     * @param lower The lower bound of the range.
     * @param upper The upper bound of the range.
     * @returns True if the number is within the range, false othewise.
     */
    private static inRange(target: number, lower: number, upper: number): boolean {
        return lower <= target && target <= upper;
    }

    /**
     * Calculates the point of intersection between this and another edge.
     * @param edge The edge to intersect with this one.
     * @returns The point of intersection if it exists, null otherwise.
     */
    public intersectEdge(edge: Edge): Vector {
        let p: Vector = this.start.copy();
        let q: Vector = edge.start.copy();
        let r: Vector = Vector.subtract(this.end, p);
        let s: Vector = Vector.subtract(edge.end, q);
        let a: Vector = Vector.subtract(q, p);
        let b: number = r.cross(s);
        let t: number = a.cross(Vector.scale(s, 1/b));
        let u: number = a.cross(Vector.scale(r, 1/b));

        if (r.cross(s) != 0 && Edge.inRange(t, 0, 1) && Edge.inRange(u, 0, 1)) {
            return p.add(r.scale(t));
        }
        
        return null;
    }
}

/**
 * Shorthand constructor for an Edge object.
 * @param start A vector representing the starting vertex of the edge.
 * @param end A vector representing the ending vertex of the edge.
 * @returns A new Edge instance.
 */
export function edge(start: Vector, end: Vector): Edge {
    return new Edge(start, end);
}