import { Unit, convertUnits } from '@iota/unit-converter'

/**
 * IOTA Units Map
 */
const UNIT_MAP: { [unit in Unit]: { val: number; dp: number } } = {
    i: { val: 1, dp: 0 },
    Ki: { val: 1000, dp: 3 },
    Mi: { val: 1000000, dp: 6 },
    Gi: { val: 1000000000, dp: 9 },
    Ti: { val: 1000000000000, dp: 12 },
    Pi: { val: 1000000000000000, dp: 15 },
}

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
    const unit: Unit = getUnit(value)

    if (!value) {
        return `0 ${unit}`
    }

    return unit === Unit.i ? `${value} ${Unit.i}` : `${convertUnits(value, Unit.i, unit).toFixed(decimalPlaces)} ${unit}`
}

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
    let bestUnits: Unit = Unit.i

    if (!value) {
        return bestUnits
    }

    const checkLength = Math.abs(value).toString().length

    if (checkLength > UNIT_MAP.Pi.dp) {
        bestUnits = Unit.Pi
    } else if (checkLength > UNIT_MAP.Ti.dp) {
        bestUnits = Unit.Ti
    } else if (checkLength > UNIT_MAP.Gi.dp) {
        bestUnits = Unit.Gi
    } else if (checkLength > UNIT_MAP.Mi.dp) {
        bestUnits = Unit.Mi
    } else if (checkLength > UNIT_MAP.Ki.dp) {
        bestUnits = Unit.Ki
    }

    return bestUnits
}

/**
 * Convert the value to different units.
 * @param value The value to convert.
 * @param fromUnit The form unit.
 * @param toUnit The to unit.
 * @returns The formatted unit.
 */
export const convertUnitsNoE = (value: number, fromUnit: Unit, toUnit: Unit): string => {
    if (!value) {
        return "0";
    }
    if (!UNIT_MAP[fromUnit]) {
        throw new Error(`Unrecognized fromUnit ${fromUnit}`);
    }
    if (!UNIT_MAP[toUnit]) {
        throw new Error(`Unrecognized toUnit ${toUnit}`);
    }
    if (fromUnit === "i" && value % 1 !== 0) {
        throw new Error("If fromUnit is 'i' the value must be an integer value");
    }

    if (fromUnit === toUnit) {
        return value.toString();
    }

    const scaledValue = Math.abs(Number(value)) *
        UNIT_MAP[fromUnit].val /
        UNIT_MAP[toUnit].val;
    const numDecimals = UNIT_MAP[toUnit].dp;

    // We cant use toFixed to just convert the new value to a string with
    // fixed decimal places as it will round, which we don't want
    // instead we want to convert the value to a string and manually
    // truncate the number of digits after the decimal
    // Unfortunately large numbers end up in scientific notation with
    // the regular toString() so we use a custom conversion.
    let fixed = scaledValue.toString();
    if (fixed.includes("e")) {
        fixed = scaledValue.toFixed(Number.parseInt(fixed.split("-")[1], 10));
    }

    // Now we have the number as a full string we can split it into
    // whole and decimals parts
    const parts = fixed.split(".");
    if (parts.length === 1) {
        parts.push("0");
    }

    // Now truncate the decimals by the number allowed on the toUnit
    parts[1] = parts[1].slice(0, numDecimals);

    // Finally join the parts
    return toUnit === Unit.i ? parts[0] : `${parts[0]}.${parts[1] || "0"}`;
}
