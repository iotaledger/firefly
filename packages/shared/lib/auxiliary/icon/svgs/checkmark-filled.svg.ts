import { FillPriority } from '../enums'
import { ISvg } from '../interfaces'

export const CHECKMARK_FILLED_SVG: ISvg = {
    width: 24,
    height: 24,
    path: [
        {
            d: 'M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z',
            fillRule: 'evenodd',
            clipRule: 'evenodd',
        },
        {
            d: 'M16.227 8.86611C16.6062 9.26763 16.5881 9.90054 16.1866 10.2798L10.4801 15.447L7.79289 12.7598C7.40237 12.3693 7.40237 11.7362 7.79289 11.3456C8.18342 10.9551 8.81658 10.9551 9.20711 11.3456L10.5199 12.6584L14.8134 8.82572C15.2149 8.44651 15.8478 8.4646 16.227 8.86611Z',
            fillPriority: FillPriority.Primary,
        },
    ],
}
