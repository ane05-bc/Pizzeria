// lib/decimal.ts
export function decimalToNumber(decimal: any): number {
  if (!decimal) return 0;
  if (typeof decimal === 'number') return decimal;
  if (decimal.s !== undefined && decimal.e !== undefined && decimal.d !== undefined) {
    // Formato Decimal128: { s: sign, e: exponent, d: digits[] }
    const sign = decimal.s === 0 ? 1 : -1;
    const exponent = decimal.e - decimal.d.length;
    let value = 0;
    for (let i = 0; i < decimal.d.length; i++) {
      value = value * 10 + decimal.d[i];
    }
    return sign * value * Math.pow(10, exponent);
  }
  return Number(decimal);
}