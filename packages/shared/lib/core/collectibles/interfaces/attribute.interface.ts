import { NftAttributeDisplayType } from '../enums'
import { NftAttributeTrait, NftAttributeValue } from '../types'

export interface INftAttribute {
    trait_type: NftAttributeTrait
    value: NftAttributeValue
    display_type?: NftAttributeDisplayType
}
