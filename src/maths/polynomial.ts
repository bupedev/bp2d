// https://stackoverflow.com/questions/16052689/how-to-find-intersection-points-between-two-cubic-bezier-curve
// https://en.wikipedia.org/wiki/Laguerre%27s_method

export class Polynomial {
    public readonly coefficients: Array<number>;

    constructor(coefficients: Array<number>) {
        this.coefficients = coefficients.slice();
    }

    public toString(): string {
        let str = "";
        for(let i = this.coefficients.length - 1; i >= 0; i--) {
            const coefficient = this.coefficients[i];
            if(coefficient == 0) {
                continue;
            }

            let coefficientString = Math.abs(coefficient).toString();
            if(Math.abs(coefficient) == 1) {
                coefficientString = "";
            }

            if(i == this.coefficients.length - 1 && coefficient < 0) {
                str += "-";
            }
            else if(i < this.coefficients.length - 1) {
                str += ` ${coefficient < 0 ? "-" : "+"} `;
            }

            str += `${coefficientString}`;

            if(i < 1) {
                continue;
            }

            str += "x";

            if(i < 2) {
                continue;
            }
            
            str += `^${i}`;

        }
        return str;
    }

    public evaluate(value: number): number {
        let sum = 0;
        for(let i = 0; i < this.coefficients.length; i++) {
            sum += this.coefficients[i] * (value ** i);
        }
        return sum;
    }

    public getDerivative(order: number = 1): Polynomial 
    {
        let baseCoefficients = this.coefficients.slice();
        let derivativeCoefficients: Array<number> = baseCoefficients.slice();

        while(order-- > 0) {
            derivativeCoefficients = [];
            for(let i = 1; i < baseCoefficients.length; i++)
            {
                const coefficient = baseCoefficients[i];
                derivativeCoefficients.push(coefficient * i);
            }
            baseCoefficients = derivativeCoefficients.slice();
        }

        return new Polynomial(derivativeCoefficients);
    }

    public getRoot(guess: number = 0, threshold: number = 1e-9, maxIterations: number = 100): number {
        const firstDerivative = this.getDerivative();
        const secondDerivative = firstDerivative.getDerivative();
        
        let k = 0;
        let xk = guess;
        let pk0 = this.evaluate(xk);
        while(pk0 > threshold && k < maxIterations) {
            const pk1 = firstDerivative.evaluate(xk);
            const pk2 = secondDerivative.evaluate(xk);
            const G = pk1/pk0;
            const H = (G ** 2) - pk2 / pk0;
            const det = ((k - 1) * (k * H - G ** 2)) ** 0.5;
            const d0 = G + det;
            const d1 = G - det;
            const a = k / Math.max(d0, d1);

            k++;
            xk -= a;
            pk0 = this.evaluate(xk);
        }
        
        return xk;
    }
}