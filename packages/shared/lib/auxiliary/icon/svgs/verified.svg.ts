import { FillPriority } from '../enums'
import { ISvg } from '../interfaces'

export const VERIFIED_SVG: ISvg = {
    width: 14,
    height: 14,
    path: [
        {
            fillPriority: FillPriority.Secondary,
            d: 'M 7, 7 m -3, 0 a 3,3 0 1,0 6,0 a 3,3 0 1,0 -7,0',
            fillRule: 'evenodd',
            clipRule: 'evenodd',
        },
        {
            fillPriority: FillPriority.Primary,
            d: 'M5.01634 13.125L3.90801 11.2583L1.80801 10.7917L2.01217 8.63333L0.583008 7L2.01217 5.36667L1.80801 3.20833L3.90801 2.74167L5.01634 0.875L6.99967 1.72083L8.98301 0.875L10.0913 2.74167L12.1913 3.20833L11.9872 5.36667L13.4163 7L11.9872 8.63333L12.1913 10.7917L10.0913 11.2583L8.98301 13.125L6.99967 12.2792L5.01634 13.125ZM6.38717 9.07083L9.68301 5.775L8.86634 4.92917L6.38717 7.40833L5.13301 6.18333L4.31634 7L6.38717 9.07083Z',
            fillRule: 'evenodd',
            clipRule: 'evenodd',
        },
    ],
}
