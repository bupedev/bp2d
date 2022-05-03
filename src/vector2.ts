/**
 * Describes a vector in 2-dimensional space.
 */
export class Vector2 {
    /**
     * TODO: 
     *  - Reconsider whether X and y of a Vector2 instance should be outwardly mutable.
     *  - Implement an equivalency method with an in-built adjustable threshold for "roughly" comparing vectors
     */

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
     * Creates a new Vector2 object with the same properties of this one.
     * @returns A new Vector2 object.
     */
    public copy(): Vector2 {
        return new Vector2(this.x, this.y);
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
    public static unit(angle: number): Vector2 {
        let standard = Vector2.standardizeAngle(angle);
        return new Vector2(Math.cos(standard), Math.sin(standard));
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
        return Vector2.standardizeAngle(Math.atan2(this.y, this.x));
    }

    /**
     * Calculates the dot (scalar) product of this and another vector.
     * @param other The vector to calculate the dot product with.
     * @returns The dot product of the two vectors.
     */
    public dot(other: Vector2): number {
        return this.x * other.x + this.y * other.y;
    }

    /**
     * Calculates the magnitude of the cross (vector) product of this and another vector.
     * @param other The vector to calculate the cross product with.
     * @returns The magnitude of the cross product of the two vectors.
     */
    public cross(other: Vector2): number {
        return this.x * other.y - this.y * other.x;
    }

    /**
     * Calculates the angle this vector makes with another vector. The angle between the two vectors is always assumed
     * to be measured counter-clockwise from this vector.
     * @param other The vector the calculate the angle to.
     * @returns The angle in radians.
     */
    public angleBetween(other: Vector2): number {
        return Vector2.standardizeAngle(other.angle() - this.angle());
    }

    /**
     * Adds the proportions of another vector to this one.
     * @param other The vector with proportions to add to this one.
     * @returns The sum of the vectors.
     */
     public add(other: Vector2): Vector2 {
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
     public static add(vectorA: Vector2, vectorB: Vector2): Vector2 {
        return vectorA.copy().add(vectorB);
    }

    /**
     * Subtracts the proportions of another vector from this one.
     * @param other The vector with proportions to subtract from this one.
     * @returns The difference of the vectors.
     */
    public subtract(other: Vector2): Vector2 {
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
    public static subtract(vectorA: Vector2, vectorB: Vector2): Vector2 {
        return vectorA.copy().add(vectorB);
    }

    /**
     * Scales the vector by some amount.
     * @param factor The amount to scale the vector by.
     * @returns This vector after scaling.
     */
    public scale(factor: number): Vector2 {
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
     public static scale(vector: Vector2, factor: number): Vector2 {
        return vector.copy().scale(factor);
    }

    /**
     * Normalizes the vector (scales its magnitude to 1).
     * @returns This vector after normalization.
     */
    public normalize(): Vector2 {
        let length = this.magnitude();
        if(length == 0) return this;
        this.x /= length;
        this.y /= length;
        return this;
    }

    /**
     * Normalizes a vector (scales its magnitude to 1).
     * @param vector The vector to normalize.
     * @returns A new normalized vector.
     */
     public static normalize(vector: Vector2): Vector2 {
        return vector.copy().normalize();
    }

    /**
     * Rotates the vector by some angle.
     * @param angle The amount to rotate the vector by in radians.
     * @returns The vector after rotation.
     */
    public rotate(angle: number): Vector2 {
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
     public static rotate(vector: Vector2, angle: number): Vector2 {
        return vector.copy().rotate(angle);
    }

    /**
     * Reflects the vector along an axis defined by some vector.
     * @param axis The axis along which to reflect the vector.
     * @returns The vector after reflection.
     */
    public reflect(axis: Vector2): Vector2 {
        let angle = Vector2.standardizeAngle(2*axis.angle());
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
     public static reflect(vector: Vector2, axis: Vector2): Vector2 {
        return vector.copy().reflect(axis);
    }
}