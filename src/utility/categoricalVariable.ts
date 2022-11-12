/**
 * A categorical variable with a customizable distribution. This class will manage a dictionary of categories and their 
 * weightings. Categories can be selected by providing a normalized value that is mapped based on the category weights.
 */
export class CategoricalVariable {
    private _categoryWeights: { [value: string]: number; };

    /**
     * A copy of the collection of valid categories for the variable.
     */
    public get categories(): string[] {
        return Object.keys(this._categoryWeights).slice();
    }

    /**
     * A copy of the collection of normalized weights for each of the variable categories.
     */
    public get weights(): number[] {
        return Object.values(this._categoryWeights).slice();
    }

    /**
     * The number of categories for the variable.
     */
    public get span(): number {
        return Object.keys(this._categoryWeights).length;
    }

    /**
     * Constructs the categorical variable with weights for each category.
     * @param categoryWeights The category weights as a dictionary. The weights do not need to be normalized.
     */
    constructor(categoryWeights: { [value: string]: number; }) {
        this._categoryWeights = {};
        let total = Object.values(categoryWeights).reduce((prev, current, index, array) => prev + current);
        Object.keys(categoryWeights).forEach(category => {
            this._categoryWeights[category] = categoryWeights[category] / total;
        });
    }

    /**
     * Determines which category corresponds to a normalized value. Each category will be assigned a range of normalized values 
     * depending on the weightings provided when the class was constructed.
     * @param value The normalized value from which to select the category.
     * @returns The category corresponding to the normalized value.
     */
    public getCategory(value: number): string {
        let selected = null;
        let cumulative_total = 0;
        let categories = Object.keys(this._categoryWeights);
        categories.forEach(category => {
            cumulative_total += this._categoryWeights[category];
            if (!selected && cumulative_total > value) {
                selected = category;
            }
        });

        if (!selected) {
            selected = categories[categories.length - 1];
        }

        return selected;
    }

    /**
     * Retrieves the normalized weighting for a category.
     * @param category The category for which to retrieve the normalized weighting.
     * @returns The normalized weighting for the category, if the category does not exist null is returned instead.
     */
    public getWeighting(category: string): number {
        return this._categoryWeights[category];
    }
}