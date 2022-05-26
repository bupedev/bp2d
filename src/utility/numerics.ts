/**
 * Computes the modulo of some number (the dividend) by some divisor.
 * @param x The dividend of the operation.
 * @param m The divisor of the operation.
 * @returns The result of the modulo operation.
 */
export function mod(x: number, m: number): number {
    let r = x % m;
    return r < 0 ? r + m : r;
}

/**
 * Determines whether some number is within an inclusive range defined by two bounding numbers.
 * @param target The number to check the range for.
 * @param lower The lower bound of the range.
 * @param upper The upper bound of the range.
 * @returns True if the number is within the range, false otherwise.
 */
export function inRange(target: number, lower: number, upper: number): boolean {
    return lower <= target && target <= upper;
}