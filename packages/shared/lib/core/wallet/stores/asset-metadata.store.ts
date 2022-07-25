import { persistent } from '@lib/helpers'
import { IPersistedAssetMetadata } from '../interfaces/persisted-asset-metadata.interface'

export const assetMetadatas = persistent<IPersistedAssetMetadata>('assetMetadata', {})
