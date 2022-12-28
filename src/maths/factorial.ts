
var f = [1, 1];
var i = 2;
export function factorial(n: number): number {
    if (typeof f[n] != 'undefined')
        return f[n];
    var result = f[i - 1];
    for (; i <= n; i++)
        f[i] = result = result * i;
    return result;
}
