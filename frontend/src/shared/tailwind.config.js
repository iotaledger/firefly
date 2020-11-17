const plugin = require("tailwindcss/plugin");
const selectorParser = require("postcss-selector-parser");

/* Utilities */
const pxToRem = (px, base = 16) => `${px / base}rem`

module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    extend: {
      fontSize: {
        10: pxToRem(10),
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
    textColor: ['dark', 'responsive', 'hover', 'dark-hover', 'focus'],
    backgroundColor: ['dark', 'responsive', 'hover', 'dark-hover', 'focus']
  },
  plugins: [
    // Reference: https://dev.to/smartmointy/tailwind-css-dark-mode-switch-with-javascript-2kl9
    plugin(function ({ addVariant, prefix }) {
      addVariant('dark', ({ modifySelectors, separator}) => {
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
      addVariant('dark-hover', ({ modifySelectors, separator}) => {
        modifySelectors(({ className }) => {
          return `.scheme-dark .${e(`dark\:hover${separator}${className}`)}:hover`
        })
      })
    })
  ],
}