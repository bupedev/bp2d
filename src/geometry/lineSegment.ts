import { Vertex } from './vertex'
import { Vector } from './vector'
import { inRange } from './../utility/numerics'

/**
 * A line segment in two dimensional space.
 */
export class LineSegment {
    /**
     * The starting vertex of the line segment.
     */
    public start: Vertex;

    /**
     * The ending vertex of the line segment.
     */
    public end: Vertex;

    /**
     * Constructs an line segment with specified starting and ending vertices.
     * @param start A vertex representing the starting vertex of the line segment.
     * @param end A vertex representing the ending vertex of the line segment.
     */
    constructor(start: Vertex, end: Vertex) {
        this.start = start;
        this.end = end;
    }

    /**
     * Creates a new line segment object with the same properties of this one.
     * @returns A new line segment object.
     */
    public copy(): LineSegment {
        return lineSegment(this.start.copy(), this.end.copy());
    }

    /**
     * Creates a user-friendly formatted string for the line segment. Elements are contained in parenthesis, separated by 
     * commas and formatted as user-friendly vertices.
     * @returns A formatted string representing the line segment.
     */
    public toString(): string {
        return `(${this.start}, ${this.end})`;
    }

    /**
     * Creates a displacement vector between the start and end of the line segment.
     * @param reverse Creates a displacement vector in the opposite direction if true.
     * @returns A displacement vector.
     */
    public direction(reverse: boolean = false): Vector {
        return Vector.subtract(this.end.toVector(), this.start.toVector()).scale(reverse ? -1 : 1);
    }

    /**
     * Creates a vector normal to the line segment. The method operates under the assumption that the line segment is an edge of a CCW polygon.
     * @param clockwise Creates a normal vector in the opposite direction.
     * @returns A normal vector.
     */
    public normal(clockwise: boolean = false): Vector {
        return this.direction(clockwise).normalize().rotate(-Math.PI / 2);
    }

    /**
     * Calculates the length of the line segment.
     * @returns The length of the line segment.
     */
    public length(): number {
        return this.direction().magnitude();
    }

    /**
     * Calculates the point of intersection between this and another line segment.
     * @param lineSegment The line segment to intersect with this one.
     * @returns The point of intersection if it exists, null otherwise.
     */
    public intersectLineSegment(lineSegment: LineSegment): Vertex | null {
        let p: Vector = this.start.toVector();
        let q: Vector = lineSegment.start.toVector();
        let r: Vector = Vector.subtract(this.end.toVector(), p);
        let s: Vector = Vector.subtract(lineSegment.end.toVector(), q);
        let a: Vector = Vector.subtract(q, p);
        let b: number = r.cross(s);
        let t: number = a.cross(Vector.scale(s, 1 / b));
        let u: number = a.cross(Vector.scale(r, 1 / b));

        if (r.cross(s) != 0 && inRange(t, 0, 1) && inRange(u, 0, 1)) {
            return p.add(r.scale(t)).toVertex();
        }

        return null;
    }

    /**
     * LineSegmentarly interpolates a line segment that lies between two line segments.
     * @param start The first line segment between which to line segmentarly interpolate.
     * @param end The second line segment between which to line segmentarly interpolate.
     * @param proportion The proportion by which to interpolate. 0.0 represents the first line segment, while 1.0 represents the second line segment.
     */
    public static lerp(start: LineSegment, end: LineSegment, proportion: number): LineSegment {
        return lineSegment(Vertex.lerp(start.start, end.start, proportion), Vertex.lerp(start.end, end.end, proportion))
    }
}

/**
 * Shorthand constructor for an line segment object.
 * @param start The starting vertex of the line segment.
 * @param end The ending vertex of the line segment.
 * @returns A new line segment instance.
 */
export function lineSegment(start: Vertex, end: Vertex): LineSegment {
    return new LineSegment(start, end);
}