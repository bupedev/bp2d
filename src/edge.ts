import { Vector2 } from './vector2'

/**
 * A polygonal edge in 2-dimensional space, effectively a line segment.
 */
export class Edge {
    /**
     * A vector representing the starting vertex of the edge.
     */
    public start: Vector2;

    /**
     * A vector representing the ending vertex of the edge.
     */
    public end: Vector2;

    /**
     * Constructs an edge with specified starting and ending vertices.
     * @param start A vector representing the starting vertex of the edge.
     * @param end A vector representing the ending vertex of the edge.
     */
    constructor(start: Vector2, end: Vector2) {
        this.start = start;
        this.end = end;
    }
} 