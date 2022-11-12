import { CategoricalVariable } from '../../../src/index';

let total = 10;
let colorSpan = 4;
let colors: { [value: string]: number; } = {
    "blue": 3,
    "red": 1,
    "green": 2,
    "white": 4
};

describe('Constructor', () => {
    it('should store categories correctly', () => {
        let cv = new CategoricalVariable(colors);
        let categories = cv.categories;
        let span = cv.span;

        expect(span).toBe(colorSpan);
        for (let category in colors) {
            expect(categories).toContain(category);
        }
    });

    it('should compute normalized weights correctly', () => {
        let cv = new CategoricalVariable(colors);
        let categories = cv.categories;
        let weights = cv.weights;

        for (let category in colors) {
            let categoryIndex = categories.findIndex(c => c == category);
            expect(weights[categoryIndex]).toBe(colors[category] / total);
        }
    });
});

describe('Categories Accessor', () => {
    it('should store a copy of the categories', () => {
        let instance = { ...colors };
        let cv = new CategoricalVariable(instance);
        delete instance["red"];
        let categories = cv.categories;

        expect(categories["red"]).not.toBeNull();
    });

    it('should return a copy of the categories', () => {
        let instance = { ...colors };
        let cv = new CategoricalVariable(instance);
        let storedA = cv.categories;
        storedA[0] = null;
        let storedB = cv.categories;

        expect(storedA[0]).not.toBe(storedB[0]);
    });
});

describe('Weights Accessor', () => {
    it('should store a normalized copy of the weights', () => {
        let instance = { ...colors };
        let cv = new CategoricalVariable(instance);
        delete instance["red"];
        let weights = cv.weights;

        expect(weights[Object.keys(instance).indexOf("red")]).not.toBeNull();
    });

    it('should return a copy of the normalized weights', () => {
        let instance = { ...colors };
        let cv = new CategoricalVariable(instance);
        let storedA = cv.weights;
        storedA[0] = null;
        let storedB = cv.weights;

        expect(storedA[0]).not.toBe(storedB[0]);
    });
});

describe('Get Category', () => {
    let expected = {
        0.01: "blue",
        0.06: "blue",
        0.11: "blue",
        0.16: "blue",
        0.21: "blue",
        0.26: "blue",
        0.31: "red",
        0.36: "red",
        0.41: "green",
        0.46: "green",
        0.51: "green",
        0.56: "green",
        0.61: "white",
        0.66: "white",
        0.71: "white",
        0.76: "white",
        0.81: "white",
        0.86: "white",
        0.91: "white",
        0.96: "white",
        1.00: "white",
    };

    Object.keys(expected).forEach(valueString => {
        let category = expected[valueString], value = Number(valueString);
        it(`should choose ${category} when the value is ${value}`, () => {
            let cv = new CategoricalVariable(colors);
            let chosen = cv.getCategory(value);
            expect(chosen).toBe(category);
        });
    });
});

describe('Get Weight', () => {
    let expected = {
        "blue": 3 / 10,
        "red": 1 / 10,
        "green": 2 / 10,
        "white": 4 / 10
    };

    Object.keys(expected).forEach(category => {
        let weighting = expected[category];
        it(`should provide the normalized weighting ${weighting} when the category is ${category}`, () => {
            let cv = new CategoricalVariable(colors);
            let chosen = cv.getWeighting(category);
            expect(chosen).toBeCloseTo(weighting);
        });
    });
});

