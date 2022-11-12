import { Vertex } from './vertex'
import { Vector } from './vector'
import { inRange } from './../utility/numerics'

/**
 * A line in two dimensional space.
 */
export class Line {
    /**
     * The starting vertex of the line.
     */
    public start: Vertex;

    /**
     * The ending vertex of the line.
     */
    public end: Vertex;

    /**
     * Constructs an line with specified starting and ending vertices.
     * @param start A vertex representing the starting vertex of the line.
     * @param end A vertex representing the ending vertex of the line.
     */
    constructor(start: Vertex, end: Vertex) {
        this.start = start;
        this.end = end;
    }

    /**
     * Creates a new line object with the same properties of this one.
     * @returns A new line object.
     */
    public copy(): Line {
        return line(this.start.copy(), this.end.copy());
    }

    /**
     * Creates a user-friendly formatted string for the line. Elements are contained in parenthesis, separated by 
     * commas and formatted as user-friendly vertices.
     * @returns A formatted string representing the line.
     */
    public toString(): string {
        return `(${this.start}, ${this.end})`;
    }

    /**
     * Creates a displacement vector between the start and end of the line.
     * @param reverse Creates a displacement vector in the opposite direction if true.
     * @returns A displacement vector.
     */
    public direction(reverse: boolean = false): Vector {
        return Vector.subtract(this.end.toVector(), this.start.toVector()).scale(reverse ? -1 : 1);
    }

    /**
     * Creates a vector normal to the line. The method operates under the assumption that the line is an edge of a CCW polygon.
     * @param clockwise Creates a normal vector in the opposite direction.
     * @returns A normal vector.
     */
    public normal(clockwise: boolean = false): Vector {
        return this.direction(clockwise).normalize().rotate(-Math.PI / 2);
    }

    /**
     * Calculates the length of the line.
     * @returns The length of the line.
     */
    public length(): number {
        return this.direction().magnitude();
    }

    /**
     * Calculates the point of intersection between this and another line.
     * @param line The line to intersect with this one.
     * @returns The point of intersection if it exists, null otherwise.
     */
    public intersectLine(line: Line): Vertex {
        let p: Vector = this.start.toVector();
        let q: Vector = line.start.toVector();
        let r: Vector = Vector.subtract(this.end.toVector(), p);
        let s: Vector = Vector.subtract(line.end.toVector(), q);
        let a: Vector = Vector.subtract(q, p);
        let b: number = r.cross(s);
        let t: number = a.cross(Vector.scale(s, 1 / b));
        let u: number = a.cross(Vector.scale(r, 1 / b));

        if (r.cross(s) != 0 && inRange(t, 0, 1) && inRange(u, 0, 1)) {
            return p.add(r.scale(t)).toVertex();
        }

        return null;
    }
}

/**
 * Shorthand constructor for an line object.
 * @param start The starting vertex of the line.
 * @param end The ending vertex of the line.
 * @returns A new line instance.
 */
export function line(start: Vertex, end: Vertex): Line {
    return new Line(start, end);
}