const plugin = require('tailwindcss/plugin')
const selectorParser = require('postcss-selector-parser')

/* Utilities */
const pxToRem = (px, base = 16) => `${px / base}rem`

const IS_DESKOP = process.env.PLATFORM === 'desktop'
const SHARED_CONTENT_ROUTES = ['../shared/**/*.svelte', '../shared/**/*.scss']
const DESKTOP_CONTENT_ROUTES = ['../desktop/**/*.svelte']
const MOBILE_CONTENT_ROUTES = ['../mobile/**/*.svelte']

module.exports = {
    content: [...SHARED_CONTENT_ROUTES, ...(IS_DESKOP ? DESKTOP_CONTENT_ROUTES : MOBILE_CONTENT_ROUTES)],
    safelist: [
        {
            pattern: /^from-/,
        },
        {
            pattern: /^to-/,
        },
        {
            pattern: /^bg-/,
        },
        {
            pattern: /^border-/,
        },
        {
            pattern: /^text-/,
        },
        {
            pattern: /^font-/,
        },
        {
            pattern: /^grid-cols-/,
        },
        {
            pattern: /^rounded-/,
        },
        {
            pattern: /^p-/,
        },
    ],
    theme: {
        colors: {
            current: 'currentColor',
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
                100: '#DFFAEA',
                200: '#CFF8DF',
                300: '#BFF5D5',
                400: '#90EEB6',
                500: '#61E897',
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
                600: '#6E82A4',
                700: '#405985',
                800: '#25395F',
                850: '#223457',
                900: '#1B2D4B',
                1000: '#15233B',
            },
            transparent: 'transparent',
            black: '#000',
            white: '#fff',
            pastel: {
                blue: '#EEFBFF',
                orange: '#FFF8EF',
                green: '#F7FFED',
                yellow: '#FFF9EF',
                pink: '#FFF3F8',
                purple: '#EFF0FE',
            },
            iota: {
                bg: '#FFFFFF',
                highlight: '#000000',
            },
            shimmer: {
                bg: '#020F26',
                highlight: '#17E1D5',
            },
            assembly: {
                bg: '#08080C',
                highlight: '#FF3FF2',
            },
            'verification-blue': '#3897F0',
        },
        extend: {
            fontSize: {
                8: pxToRem(8),
                9: pxToRem(9),
                10: pxToRem(10),
                11: pxToRem(11),
                12: pxToRem(12),
                13: pxToRem(13),
                14: pxToRem(14),
                15: pxToRem(15),
                16: pxToRem(16),
                18: pxToRem(18),
                20: pxToRem(20),
                22: pxToRem(22),
                24: pxToRem(24),
                28: pxToRem(28),
                30: pxToRem(30),
                32: pxToRem(32),
                36: pxToRem(36),
                48: pxToRem(48),
                64: pxToRem(64),
            },
            lineHeight: {
                3.5: pxToRem(14),
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
            keyframes: {
                spinReverse: {
                    from: {
                        transform: 'rotate(360deg)',
                    },
                    to: {
                        transform: 'rotate(0deg)',
                    },
                },
                shake: {
                    '8%, 41%': {
                        transform: 'translateX(-10px)',
                    },
                    '25%, 58%': {
                        transform: 'translateX(10px)',
                    },
                    '75%': {
                        transform: 'translateX(-5px)',
                    },
                    '92%': {
                        transform: 'translateX(5px)',
                    },
                    '0%, 100%': {
                        transform: 'translateX(0)',
                    },
                },
            },
            animation: {
                'spin-reverse': 'spinReverse 1s linear infinite;',
                shake: 'shake .5s linear;',
            },
            boxShadow: {
                'elevation-1': '0px 1px 2px rgba(0, 0, 0, 0.08)',
                'elevation-2': '0px 2px 6px rgba(0, 0, 0, 0.08)',
                'elevation-3': '0px 4px 6px rgba(0, 0, 0, 0.08)',
                'elevation-4': '0px 4px 12px rgba(0, 0, 0, 0.12)',
            },
            borderWidth: {
                3: '3px',
            },
            spacing: {
                4.5: pxToRem('18'),
                6.75: pxToRem('27'),
                18: pxToRem('72'),
                98: pxToRem('392'),
            },
            borderRadius: {
                2: pxToRem(2),
                4: pxToRem(4),
                6: pxToRem(6),
                8: pxToRem(8),
                10: pxToRem(10),
                12: pxToRem(12),
                16: pxToRem(16),
                24: pxToRem(24),
            },
            maxHeight: {
                xl: pxToRem(648),
                100: pxToRem(400),
            },
            height: {
                fit: 'fit-content',
            },
            width: {
                100: pxToRem(400),
            },
        },
        fontFamily: {
            'fira-mono': ['"Fira Mono"', 'monospace'],
            inter: ['Inter'],
        },
    },
}
