const plugin = require('tailwindcss/plugin')
const selectorParser = require('postcss-selector-parser')

/* Utilities */
const pxToRem = (px, base = 16) => `${px / base}rem`

module.exports = {
    future: {
        // removeDeprecatedGapUtilities: true,
        // purgeLayersByDefault: true,
    },
    purge: [],
    theme: {
        colors: {
            blue: {
                50: '#F2F9FF',
                100: '#D9EDFF',
                200: '#B7DCFF',
                300: '#87C5FF',
                400: '#57AEFF',
                500: '#108CFF',
                600: '#0066FF',
                700: '#0F4CEB',
                800: '#0040A0',
                900: '#002D56',
            },
            lightblue: {
                50: '#F3FCFE',
                100: '#E8FAFE',
                200: '#D2F5FD',
                300: '#B8F2FF',
                400: '#8FE6FA',
                500: '#79E5FE',
                600: '#3ADBFF',
                700: '#00C7F4',
                800: '#00A8DD',
                900: '#006996',
            },
            purple: {
                50: '#EFF0FE',
                100: '#E0E1FD',
                200: '#D1D2FC',
                300: '#B2B4FA',
                400: '#9396F8',
                500: '#666AF6',
                600: '#5A58E4',
                700: '#5339BD',
                800: '#3F1E9E',
                900: '#2F0883',
            },
            turquoise: {
                50: '#E7FCFA',
                100: '#D0F9F6',
                200: '#8BF0EA',
                300: '#5CEAE1',
                400: '#45E7DD',
                500: '#17E1D5',
                600: '#14CABF',
                700: '#12B4AA',
                800: '#0D877F',
                900: '#095A55',
            },
            green: {
                50: '#EFFCF4',
                100: '#61E897',
                200: '#DFFAEA',
                300: '#CFF8DF',
                400: '#BFF5D5',
                500: '#90EEB6',
                600: '#57D087',
                700: '#38B86B',
                800: '#229E53',
                900: '#1D703F',
            },
            yellow: {
                50: '#FFF9EF',
                100: '#FFF4DF',
                200: '#FFE9C0',
                300: '#FFDFA0',
                400: '#FFD481',
                500: '#FFCA62',
                600: '#FFB526',
                700: '#FFA800',
                800: '#CB8600',
                900: '#9E6800',
            },
            orange: {
                50: '#FFF3EE',
                100: '#FFE7DE',
                200: '#FFD0BD',
                300: '#FFB99D',
                400: '#FFA27C',
                500: '#FF8B5C',
                600: '#FA6E34',
                700: '#E8561B',
                800: '#9F340A',
                900: '#6F2003',
            },
            red: {
                50: '#FFEFEE',
                100: '#FFE0DD',
                200: '#FFD1CC',
                300: '#FFB3AA',
                400: '#FF8576',
                500: '#FF6755',
                600: '#F8523F',
                700: '#CC3725',
                800: '#991C0D',
                900: '#7C0B00',
            },
            pink: {
                50: '#FFF3F8',
                100: '#FFE7F2',
                200: '#FFD0E6',
                300: '#FFB8DA',
                400: '#FFA1CE',
                500: '#FF8AC2',
                600: '#FF76B7',
                700: '#F456A2',
                800: '#BB256D',
                900: '#A3004F',
            },
            gray: {
                50: '#F6F9FF',
                100: '#F0F5FE',
                200: '#E4EBFA',
                300: '#D8E3F5',
                400: '#C4D1E8',
                500: '#9AADCE',
                600: '#7587AB',
                700: '#4B5F84',
                800: '#25395F',
                900: '#192742',
            },
            transparent: 'transparent',
            black: '#000',
            white: '#fff',
        },
        extend: {
            fontSize: {
                10: pxToRem(10),
                11: pxToRem(11),
                12: pxToRem(12),
                13: pxToRem(13),
                14: pxToRem(14),
                16: pxToRem(16),
                18: pxToRem(18),
                20: pxToRem(20),
                22: pxToRem(22),
                24: pxToRem(24),
                30: pxToRem(30),
                32: pxToRem(32),
                36: pxToRem(36),
                48: pxToRem(48),
                64: pxToRem(64),
            },
            lineHeight: {
                100: '100%',
                110: '110%',
                120: '120%',
                130: '130%',
                140: '140%',
                150: '150%',
                160: '160%',
                170: '170%',
                180: '180%',
                190: '190%',
                200: '200%',
            },
            fontWeight: {
                100: '100',
                200: '200',
                300: '300',
                400: '400',
                500: '500',
                600: '600',
                700: '700',
                800: '800',
                900: '900',
            },
        },
    },
    variants: {
        fontWeight: ['hover', 'focus', 'group-hover'],
        textColor: ['dark', 'responsive', 'hover', 'dark-hover', 'focus', 'group-hover'],
        backgroundColor: ['dark', 'responsive', 'hover', 'dark-hover', 'focus', 'group-hover'],
        backgroundOpacity: ['dark'],
    },
    plugins: [
        // Reference: https://dev.to/smartmointy/tailwind-css-dark-mode-switch-with-javascript-2kl9
        plugin(function ({ addVariant, prefix }) {
            addVariant('dark', ({ modifySelectors, separator }) => {
                modifySelectors(({ selector }) => {
                    return selectorParser((selectors) => {
                        selectors.walkClasses((sel) => {
                            sel.value = `dark${separator}${sel.value}`
                            sel.parent.insertBefore(sel, selectorParser().astSync(prefix('.scheme-dark ')))
                        })
                    }).processSync(selector)
                })
            })
        }),
        plugin(function ({ addVariant, e }) {
            addVariant('dark-hover', ({ modifySelectors, separator }) => {
                modifySelectors(({ className }) => {
                    return `.scheme-dark .${e(`dark\:hover${separator}${className}`)}:hover`
                })
            })
        }),
    ],
}
