import { factorial } from '../maths/factorial';
import { Polynomial } from '../maths/polynomial';
import { Vector } from './vector';
import {Vertex} from './vertex';

export class Bezier {
    private vertices: Array<Vertex>;

    constructor(vertices: Array<Vertex>) {
        this.vertices = vertices.slice();
    }

    public getPolynomials(): [Polynomial, Polynomial] {
        const n = this.vertices.length - 1;
        const c = Array<Vertex>(n + 1).fill(new Vertex())
        for(let j = 0; j <= n; j++) {
            let f = 1, v = new Vector();
            for(let m = 0; m <= j - 1; m++) {
                f *= (n-m);
            }
            for(let i = 0; i <= j; i++) {
                const sgn = i + j % 2 == 0 ? 1 : -1;
                const denom = factorial(i) * factorial(j - i);
                v.add(this.vertices[i].toVector().scale(sgn/denom));
            }
            c[j] = v.scale(f).toVertex()
        }

        const px = new Polynomial(c.map(v => v.x));
        const py = new Polynomial(c.map(v => v.y));

        return [px, py];
    }
}

