import { TextType, FontWeight } from '../enums'

export type TextPropTypes = {
    type?: TextType
    fontSize?: string
    fontWeight?: FontWeight
    lineHeight?: string
    secondary?: boolean
    disabled?: boolean
    highlighted?: boolean
    bold?: boolean
    smaller?: boolean
    bigger?: boolean
    error?: boolean
    overrideColor?: boolean
    color?: string
    darkColor?: string
    overrideLeading?: boolean
    classes?: string
}
