import { Unit, convertUnits } from '@iota/unit-converter';

/**
 * IOTA Units Map
 */
const UNIT_MAP: { [unit in Unit]: { val: number; dp: number } } = {
    i: { val: 1, dp: 0 },
    Ki: { val: 1000, dp: 3 },
    Mi: { val: 1000000, dp: 6 },
    Gi: { val: 1000000000, dp: 9 },
    Ti: { val: 1000000000000, dp: 12 },
    Pi: { val: 1000000000000000, dp: 15 }
};

/**
 * Formats IOTA value
 * 
 * @method formatUnit
 * 
 * @param {number} value 
 * @param {number} decimalPlaces 
 * 
 * @returns {string}
 */
export const formatUnit = (value: number, decimalPlaces = 2): string => {
    const unit: Unit = getUnit(value);

    if (!value) {
        return `0 ${unit}`
    }

    return unit === Unit.i
        ? `${value} ${Unit.i}`
        : `${convertUnits(value, Unit.i, unit).toFixed(decimalPlaces)} ${unit}`;
};

/**
 * Gets relevant unit for IOTA value
 * 
 * @method getUnit
 * 
 * @param {number} value 
 * 
 * @returns {Unit}
 */
const getUnit = (value: number): Unit => {
    let bestUnits: Unit = Unit.i;

    if (!value) {
        return bestUnits;
    }

    const checkLength = Math.abs(value).toString().length;

    if (checkLength > UNIT_MAP.Pi.dp) {
        bestUnits = Unit.Pi
    } else if (checkLength > UNIT_MAP.Ti.dp) {
        bestUnits = Unit.Ti;
    } else if (checkLength > UNIT_MAP.Gi.dp) {
        bestUnits = Unit.Gi;
    } else if (checkLength > UNIT_MAP.Mi.dp) {
        bestUnits = Unit.Mi;
    } else if (checkLength > UNIT_MAP.Ki.dp) {
        bestUnits = Unit.Ki;
    }

    return bestUnits;
};
