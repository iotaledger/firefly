export type Units = 'Pi' | 'Ti' | 'Gi' | 'Mi' | 'Ki' | 'i';

const UNIT_MAP: { [unit in Units]: { val: number; dp: number } } = {
    i: { val: 1, dp: 0 },
    Ki: { val: 1000, dp: 3 },
    Mi: { val: 1000000, dp: 6 },
    Gi: { val: 1000000000, dp: 9 },
    Ti: { val: 1000000000000, dp: 12 },
    Pi: { val: 1000000000000000, dp: 15 }
};

export const format = (value: number, decimalPlaces = 2): string => {

};

export const formatUnits = (value: number, unit: Units, decimalPlaces: number = 2): string => {
    if (unit === 'i') {
        return `${value} i`;
    }

    return `${UnitsHelper.convertUnits(value, "i", unit).toFixed(decimalPlaces)} ${unit}`
};

