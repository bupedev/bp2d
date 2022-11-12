import { vtx, Vertex } from "./vertex";

/**
 * Describes a vector in 2-dimensional space.
 */
export class Vector {
    /**
     * The proportion of the vector in the x-dimension.
     */
    public x: number;

    /**
     * The proportion of the vector in the y-dimension.
     */
    public y: number;

    /**
    * Constructs a vector with specified dimension proportions.
    * @param x The proportion of the vector in the x-dimension, 0 by default.
    * @param y The proportion of the vector in the y-dimension, 0 by default.
    */
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Creates a new Vector object with the same properties of this one.
     * @returns A new Vector object.
     */
    public copy(): Vector {
        return vec(this.x, this.y);
    }

    /**
     * Creates a user-friendly formatted string for the vector. Elements are contained in angle braces, separated by 
     * commas and formatted with 3 decimal digits.
     * @returns A formatted string representing the vector.
     */
    public toString(): string {
        return `<${(this.x < 0 ? "" : "+") + this.x.toFixed(3)}, ${(this.y < 0 ? "" : "+") + this.y.toFixed(3)}>`;
    }

    /**
     * Converts this vector to a vertex with x and y coordinates equal to the vector proportions.
     * @returns This vector as a vertex.
     */
    public toVertex(): Vertex {
        return vtx(this.x, this.y);
    }

    /**
     * Converts an angle to be between 0 and 2 PI.
     * @param angle The angle to convert.
     */
    private static standardizeAngle(angle: number) {
        return ((angle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI)
    }

    /**
     * Returns a unit vector at a specified angle.
     * @param angle The angle from the positive x-axis in radians.
     * @returns A unit vector.
     */
    public static unit(angle: number): Vector {
        let standard = Vector.standardizeAngle(angle);
        return vec(Math.cos(standard), Math.sin(standard));
    }

    /**
     * Calculates the magnitude (length) of the vector.
     * @returns The magtiude (length) of the vector.
     */
    public magnitude(): number {
        return (this.x ** 2 + this.y ** 2) ** 0.5;
    }

    /**
     * Calculates the angle the vector makes with the positive x-axis.
     * @returns The angle in radians.
     */
    public angle(): number {
        return Vector.standardizeAngle(Math.atan2(this.y, this.x));
    }

    /**
     * Calculates the dot (scalar) product of this and another vector.
     * @param other The vector to calculate the dot product with.
     * @returns The dot product of the two vectors.
     */
    public dot(other: Vector): number {
        return this.x * other.x + this.y * other.y;
    }

    /**
     * Calculates the magnitude of the cross (vector) product of this and another vector.
     * @param other The vector to calculate the cross product with.
     * @returns The magnitude of the cross product of the two vectors.
     */
    public cross(other: Vector): number {
        return this.x * other.y - this.y * other.x;
    }

    /**
     * Calculates the angle this vector makes with another vector. The angle between the two vectors is always assumed
     * to be measured counter-clockwise from this vector.
     * @param other The vector the calculate the angle to.
     * @returns The angle in radians.
     */
    public angleBetween(other: Vector): number {
        return Vector.standardizeAngle(other.angle() - this.angle());
    }

    /**
     * Adds the proportions of another vector to this one.
     * @param other The vector with proportions to add to this one.
     * @returns The sum of the vectors.
     */
    public add(other: Vector): Vector {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    /**
     * Adds the proportions of two vectors.
     * @param vectorA The vector to add to.
     * @param vectorB The vector to add.
     * @returns The sum of the vectors.
     */
    public static add(vectorA: Vector, vectorB: Vector): Vector {
        return vectorA.copy().add(vectorB);
    }

    /**
     * Subtracts the proportions of another vector from this one.
     * @param other The vector with proportions to subtract from this one.
     * @returns The difference of the vectors.
     */
    public subtract(other: Vector): Vector {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    /**
     * Subtracts the proportions of two vectors.
     * @param vectorA The vector to subtract from.
     * @param vectorB The vector to subtract.
     * @returns The difference of the vectors.
     */
    public static subtract(vectorA: Vector, vectorB: Vector): Vector {
        return vectorA.copy().subtract(vectorB);
    }

    /**
     * Scales the vector by some amount.
     * @param factor The amount to scale the vector by.
     * @returns This vector after scaling.
     */
    public scale(factor: number): Vector {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    /**
     * Scales a vector by some amount.
     * @param vector The vector to scale.
     * @param factor The amount to scale the vector by.
     * @returns A new scaled vector.
     */
    public static scale(vector: Vector, factor: number): Vector {
        return vector.copy().scale(factor);
    }

    /**
     * Normalizes the vector (scales its magnitude to 1).
     * @returns This vector after normalization.
     */
    public normalize(): Vector {
        let length = this.magnitude();
        if (length == 0) return this;
        this.x /= length;
        this.y /= length;
        return this;
    }

    /**
     * Normalizes a vector (scales its magnitude to 1).
     * @param vector The vector to normalize.
     * @returns A new normalized vector.
     */
    public static normalize(vector: Vector): Vector {
        return vector.copy().normalize();
    }

    /**
     * Rotates the vector by some angle.
     * @param angle The amount to rotate the vector by in radians.
     * @returns The vector after rotation.
     */
    public rotate(angle: number): Vector {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        let x = this.x * cos - this.y * sin;
        let y = this.x * sin + this.y * cos;
        this.x = x, this.y = y;
        return this;
    }

    /**
     * Rotates a vector by some angle.
     * @param vector The vector to rotate.
     * @param angle The amount to rotate the vector by in radians.
     * @returns A new rotated vector
     */
    public static rotate(vector: Vector, angle: number): Vector {
        return vector.copy().rotate(angle);
    }

    /**
     * Reflects the vector along an axis defined by some vector.
     * @param axis The axis along which to reflect the vector.
     * @returns The vector after reflection.
     */
    public reflect(axis: Vector): Vector {
        let angle = Vector.standardizeAngle(2 * axis.angle());
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        let x = this.x * cos + this.y * sin;
        let y = this.x * sin - this.y * cos;
        this.x = x, this.y = y;
        return this;
    }

    /**
     * Reflects a vector along an axis defined by some vector.
     * @param vector The vector to reflect.
     * @param axis The axis along which to reflect the vector.
     * @returns A new reflected vector
     */
    public static reflect(vector: Vector, axis: Vector): Vector {
        return vector.copy().reflect(axis);
    }
}

/**
 * Shorthand constructor for a Vector object.
 * @param x The proportion of the vector in the x-dimension, 0 by default.
 * @param y The proportion of the vector in the y-dimension, 0 by default.
 * @returns A new Vector instance.
 */
export function vec(x: number = 0, y: number = 0): Vector {
    return new Vector(x, y)
}