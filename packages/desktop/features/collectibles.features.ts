import type { ICollectiblesFeatures } from '@lib/features/interfaces'

const collectiblesFeatures: ICollectiblesFeatures = {
    enabled: true,
    useCaching: {
        enabled: true, // If this is set to false, `https://*` needs to be added to `img-src` and `media-src` in `public/index.html`
    },
}

export default collectiblesFeatures
