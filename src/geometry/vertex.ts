import { vec, Vector } from "./vector";
import { lerp } from "./../utility/numerics"

/**
 * A vertex (or point) in two dimensional space.
 */
export class Vertex {
    /**
     * The precision threshold for comparing vertices. If the difference in axis coordinates between two vertices are both less 
     * than this value, they are considered to be equivalent. This is to mitigate small error margins that are to be expected for 
     * floating point operations.
     */
    public static PRECISION_THRESHOLD: number = 1E-9;

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
        return vtx(this.x, this.y);
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
     * Converts this vertex to a vector with x and y proportions equal to the vertex coordinates.
     * @returns This vertex as a vector.
     */
    public toVector(): Vector {
        return vec(this.x, this.y);
    }

    /**
     * Translates the vertex by some amount along both axes.
     * @param x The translation along the x-axis, 0 by default.
     * @param y The translation along the y-axis, 0 by default.
     * @returns The vertex after translation.
     */
    public translate(x: number = 0, y: number = 0): Vertex {
        let translated = Vertex.translate(this, x, y);
        this.x = translated.x;
        this.y = translated.y;
        return this;
    }

    /**
     * Translates a vertex by some amount along both axes.
     * @param vertex The vertex to translate.
     * @param x The translation along the x-axis, 0 by default.
     * @param y The translation along the y-axis, 0 by default.
     * @returns A new translated vertex.
     */
    public static translate(vertex: Vertex, x: number = 0, y: number = 0): Vertex {
        return vertex.toVector().add(vec(x, y)).toVertex();
    }

    /**
     * Moves the vertex by some displacement vector.
     * @param vector The vector by which to displace the vertex.
     * @returns The vertex after translation.
     */
    public displace(vector: Vector): Vertex {
        let displaced = Vertex.displace(this, vector);
        this.x = displaced.x;
        this.y = displaced.y;
        return this;
    }

    /**
     * Moves the vertex by some displacement vector.
     * @param vector The vector by which to displace the vertex.
     * @returns The vertex after translation.
     */
    public static displace(vertex: Vertex, vector: Vector): Vertex {
        return vertex.toVector().add(vector).toVertex();
    }

    /**
     * Scales the distance between the vertex and some control point.
     * @param factor The scaling factor.
     * @param control The point from which to scale the vertex, the origin by default.
     * @returns The vertex after scaling.
     */
    public scale(factor: number, control: Vertex | undefined = undefined): Vertex {
        let scaled = Vertex.scale(this, factor, control);
        this.x = scaled.x;
        this.y = scaled.y;
        return this;
    }

    /**
     * Scales the distance between a vertex and some control point.
     * @param vertex The vertex to scale.
     * @param factor The scaling factor.
     * @param control The point from which to scale the vertex, the origin by default.
     * @returns A new scaled vertex.
     */
    public static scale(vertex: Vertex, factor: number, control: Vertex | undefined = undefined): Vertex {
        let controlVec = control ? control.toVector() : vec(0, 0);
        return controlVec.add(vertex.toVector().subtract(controlVec).scale(factor)).toVertex();
    }

    /**
     * Rotates the vertex around some control point.
     * @param angle The amount to rotate the vertex by in radians.
     * @param control The point from which to rotate the vertex, the origin by default.
     * @returns The vertex after rotation.
     */
    public rotate(angle: number, control: Vertex | undefined = undefined): Vertex {
        let rotated = Vertex.rotate(this, angle, control);
        this.x = rotated.x;
        this.y = rotated.y;
        return this;
    }

    /**
     * Rotates a vertex around some control point.
     * @param vertex The vertex to rotate.
     * @param angle The amount to rotate the vertex by in radians.
     * @param control The point from which to rotate the vertex, the origin by default.
     * @returns A new rotated vertex.
     */
    public static rotate(vertex: Vertex, angle: number, control: Vertex | undefined = undefined): Vertex {
        let controlVec = control ? control.toVector() : vec(0, 0);
        return controlVec.add(vertex.toVector().subtract(controlVec).rotate(angle)).toVertex();
    }

    /**
     * Reflects the vertex along an axis projected from some control point.
     * @param axis The axis along which to reflect the vertex.
     * @param control The point from which to project the axis for reflection, the origin by default.
     * @returns The vertex after reflection.
     */
    public reflect(axis: Vector, control: Vertex | undefined = undefined): Vertex {
        let reflected = Vertex.reflect(this, axis, control);
        this.x = reflected.x;
        this.y = reflected.y;
        return this;
    }

    /**
     * Reflects a vertex along an axis projected from some control point.
     * @param vertex The vertex to reflect.
     * @param axis The axis along which to reflect the vertex.
     * @param control The point from which to project the axis for reflection, the origin by default.
     * @returns A new reflected vertex.
     */
    public static reflect(vertex: Vertex, axis: Vector, control: Vertex | undefined = undefined): Vertex {
        let controlVec = control ? control.toVector() : vec(0, 0);
        return axis.magnitude() > 0
            ? controlVec.add(vertex.toVector().subtract(controlVec).reflect(axis)).toVertex()
            : vertex.copy();
    }

    /**
     * Calculates the distance from this to another vertex.
     * @param vertex The vertex to calculate the distance to.
     * @returns The distance to the other vertex.
     */
    public distanceTo(vertex: Vertex): number {
        return Vertex.distanceBetween(this, vertex);
    }

    /**
     * Calculates the distance between two vertices.
     * @param vertexA The first vertex.
     * @param vertexB The second vertex.
     * @returns The distance between the vertices.
     */
    public static distanceBetween(vertexA: Vertex, vertexB: Vertex): number {
        return vertexB.toVector().subtract(vertexA.toVector()).magnitude();
    }

    /**
     * Calculates the angle from this to another vertex, with respect to a reference heading.
     * @param vertex The vertex to calculate the angle to.
     * @param heading The reference heading angle from this vertex measured in radians from the positive x-axis, 0 radians by default.
     * @returns The angle to the other vertex.
     */
    public angleTo(vertex: Vertex, heading: number): number {
        return Vertex.angleBetween(this, vertex, heading);
    }

    /**
     * Determines whether this vertex is equivalent to another vertex. Vertices are considered equivalent if the difference in 
     * their axis coordinates are both less than the PRECISION_THRESHOLD set for the Vertex class.
     * @param vertex The vertex to compare to this one.
     * @returns True if the this vertex is equivalent to the other vertex, false otherwise.
     */
    public isEquivalentTo(vertex: Vertex): Boolean {
        return Math.abs(this.x - vertex.x) < Vertex.PRECISION_THRESHOLD &&
            Math.abs(this.y - vertex.y) < Vertex.PRECISION_THRESHOLD;
    }

    /**
     * Calculates the angle between two vertices.
     * @param vertexA The first vertex.
     * @param vertexB The second vertex.
     * @param heading The reference heading angle from the first vertex measured in radians from the positive x-axis, 0 radians by default.
     * @returns The angle between the vertices.
     */
    public static angleBetween(vertexA: Vertex, vertexB: Vertex, heading: number): number {
        let fullAngle = Vector.unit(heading).angleBetween(vertexB.toVector().subtract(vertexA.toVector()));
        return fullAngle > Math.PI ? -(Math.PI - (fullAngle % Math.PI)) : fullAngle;
    }

    /**
     * Calculates the arithmetic mean vertex of a collection of vertices.
     * @param vertices The vertices to calculate the arithmetic mean for as an array.
     * @returns The arithmetic mean vertex of the vertices.
     */
    public static mean(vertices: Vertex[]): Vertex {
        let vertexCount = vertices.length;
        let xSum = 0;
        let ySum = 0;
        for (let i = 0; i < vertexCount; i++) {
            xSum += vertices[i].x;
            ySum += vertices[i].y;
        }
        return vtx(xSum / vertexCount, ySum / vertexCount);
    }

    /**
     * Linearly interpolates a vertex that lies between two vertices.
     * @param start The first vertex between which to linearly interpolate.
     * @param end The second vertex between which to linearly interpolate.
     * @param proportion The proportion by which to interpolate. 0.0 represents the first vertex, while 1.0 represents the second vertex.
     */
    public static lerp(start: Vertex, end: Vertex, proportion: number): Vertex {
        return vtx(lerp(start.x, end.x, proportion), lerp(start.y, end.y, proportion));
    }

    /**
     * Calculates the displacement vector that would span this and another vertex.
     * @param end The other vertex.
     * @returns The displacement vector that would span this and the other vertex.
     */
    public vectorTo(end: Vertex): Vector {
        return vec(end.x - this.x, end.y - this.y);
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