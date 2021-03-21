import Chart from 'chart.js'
import tailwindConfig from 'shared/tailwind.config.js'
import resolveConfig from 'tailwindcss/resolveConfig'

const fullConfig = resolveConfig(tailwindConfig)

Chart.defaults.global.defaultFontFamily = 'Inter'
Chart.defaults.global.defaultFontSize = 9
Chart.defaults.global.defaultFontColor = fullConfig.theme.colors.gray['500']
