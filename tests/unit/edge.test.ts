import { Edge } from '../../src/edge'
import { vec2 } from '../../src/vector2';

describe('Constructor', () => {
    it('should store vertices correctly', () => {
        let u = vec2(1, 2);
        let v = vec2(2, 1);
        let e = new Edge(u, v);

        expect(e.start).toBe(u);
        expect(e.end).toBe(v);
    });
});