export interface IKeyValueBoxList {
    [key: string]: {
        data: string
        isCopyable?: boolean
        copyValue?: string
        isTooltipVisible?: boolean
        alternateKey?: string
    }
}
