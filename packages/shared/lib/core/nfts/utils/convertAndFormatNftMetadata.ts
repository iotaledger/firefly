import { Converter } from '@iota/util.js'

export function convertAndFormatNftMetadata(metadata: unknown): string {
    if (typeof metadata === 'string') {
        const convertedMetadata = Converter.hexToUtf8(metadata)
        let formattedMetadata: string
        try {
            formattedMetadata = JSON.stringify(JSON.parse(convertedMetadata), null, 2)
        } catch (e) {
            formattedMetadata = metadata
        }
        return formattedMetadata
    }
}
