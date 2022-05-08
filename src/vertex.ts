import { Vector } from "./vector";

/**
 * A vertex (or point) in two dimensional space.
 */
export class Vertex {
    /**
     * The x-coordinate of the vertex.
     */
    public x: number;

    /**
     * The y-coordinate of the vertex.
     */
    public y: number;

    /**
     * Constructs a vertex with specified coordinates.
     * @param x The x-coordinate of the vertex, 0 by default.
     * @param y The y-coordinate of the vertex, 0 by default.
     */
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Constructs a new Vertex object with the same properties of this one.
     * @returns A new Vertex object.
     */
    public copy(): Vertex {
        return null;
    }

    /**
     * Creates a user-friendly formatted string for the vertex. Elements are contained in parenthesis, separated by 
     * commas and formatted with 3 decimal digits.
     * @returns A formatted string representing the vertex.
     */
    public toString(): string {
        return `(${(this.x < 0 ? "" : "+") + this.x.toFixed(3)}, ${(this.y < 0 ? "" : "+") + this.y.toFixed(3)})`;
    }

    /**
     * Translates the vertex by some amount along both axes.
     * @param x The translation along the x-axis, 0 by default.
     * @param y The translation along the y-axis, 0 by default.
     * @returns The vertex after translation.
     */
    public translate(x: number = 0, y: number = 0): Vertex {
        return null;
    }

    /**
     * Translates a vertex by some amount along both axes.
     * @param vertex The vertex to translate.
     * @param x The translation along the x-axis, 0 by default.
     * @param y The translation along the y-axis, 0 by default.
     * @returns A new translated vertex.
     */
    public static translate(vertex: Vertex, x: number = 0, y: number = 0): Vertex {
        return null;
    }

    /**
     * Scales the distance between the vertex and some control point.
     * @param factor The scaling factor.
     * @param control The point from which to scale the vertex, the origin by default.
     * @returns The vertex after scaling.
     */
    public scale(factor: number, control: Vertex = null): Vertex {
        return null;
    }

    /**
     * Scales the distance between a vertex and some control point.
     * @param vertex The vertex to scale.
     * @param factor The scaling factor.
     * @param control The point from which to scale the vertex, the origin by default.
     * @returns A new scaled vertex.
     */
    public static scale(vertex: Vertex, factor: number, control: Vertex = null): Vertex {
        return null;
    }

    /**
     * Rotates the vertex around some control point.
     * @param angle The amount to rotate the vertex by in radians.
     * @param control The point from which to rotate the vertex, the origin by default.
     * @returns The vertex after rotation.
     */
    public rotate(angle: number, control: Vertex = null): Vertex {
        return null;
    }

    /**
     * Rotates a vertex around some control point.
     * @param vertex The vertex to rotate.
     * @param angle The amount to rotate the vertex by in radians.
     * @param control The point from which to rotate the vertex, the origin by default.
     * @returns A new rotated vertex.
     */
    public static rotate(vertex: Vertex, angle: number, control: Vertex = null): Vertex {
        return null;
    }

    /**
     * Reflects the vertex along an axis projected from some control point.
     * @param axis The axis along which to reflect the vertex.
     * @param control The point from which to project the axis for reflection, the origin by default.
     * @returns The vertex after reflection.
     */
    public reflect(axis: Vector, control: Vertex = null): Vertex {
        return null;
    }

    /**
     * Reflects a vertex along an axis projected from some control point.
     * @param vertex The vertex to reflect.
     * @param axis The axis along which to reflect the vertex.
     * @param control The point from which to project the axis for reflection, the origin by default.
     * @returns A new reflected vertex.
     */
    public static reflect(vertex: Vertex, axis: Vector, control: Vertex = null): Vertex {
        return null;
    }

    /**
     * Calculates the distance from this to another vertex.
     * @param vertex The vertex to calculate the distance to.
     * @returns The distance to the other vertex.
     */
    public distanceTo(vertex: Vertex): number {
        return 0;
    }

    /**
     * Calculates the distance between two vertices.
     * @param vertexA The first vertex.
     * @param vertexB The second vertex.
     * @returns The distance between the vertices.
     */
    public static distanceBetween(vertexA: Vertex, vertexB: Vertex): number {
        return 0;
    }

    /**
     * Calculates the angle from this to another vertex, with respect to a reference heading.
     * @param vertex The vertex to calculate the angle to.
     * @param heading The reference heading angle from this vertex measured in radians from the positive x-axis, 0 radians by default.
     * @returns The angle to the other vertex.
     */
    public angleTo(vertex: Vertex, heading: number): number {
        return 0;
    }

    /**
     * Calculates the angle between two vertices.
     * @param vertexA The first vertex.
     * @param vertexB The second vertex.
     * @param heading The reference heading angle from the first vertex measured in radians from the positive x-axis, 0 radians by default.
     * @returns The angle between the vertices.
     */
    public static angleBetween(vertexA: Vertex, vertexB: Vertex, heading: number): number {
        return 0;
    }   
}

/**
 * Shorthand constructor for a Vertex object.
 * @param x The x-coordinate of the vertex, 0 by default.
 * @param y The y-coordinate of the vertex, 0 by default.
 * @returns A new Vertex instance.
 */
export function vtx(x: number = 0, y: number = 0) {
    return new Vertex(x, y);
}