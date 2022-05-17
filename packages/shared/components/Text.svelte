<script lang="typescript" context="module">
    export enum TextType {
        h1 = 'h1',
        h2 = 'h2',
        h3 = 'h3',
        h4 = 'h4',
        h5 = 'h5',
        p = 'p',
        pre = 'pre',
    }

    export enum FontWeightNumber {
        _100 = 'font-100',
        _200 = 'font-200',
        _300 = 'font-300',
        _400 = 'font-400',
        _500 = 'font-500',
        _600 = 'font-600',
        _700 = 'font-700',
        _800 = 'font-800',
        _900 = 'font-900',
    }

    export enum FontWeightText {
        thin = 'font-100',
        extralight = 'font-200',
        light = 'font-300',
        normal = 'font-400',
        medium = 'font-500',
        semibold = 'font-600',
        bold = 'font-700',
        extrabold = 'font-800',
        black = 'font-900',
    }

    export type TextPropTypes = {
        type?: TextType
        fontSize?: string
        fontWeight?: FontWeightNumber | FontWeightText | ''
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
        darkColoe?: string
        overrideLeading?: boolean
        classes?: string
    }
</script>

<script lang="typescript">
    export let type: TextType = TextType.p
    export let fontSize = ''
    export let fontWeight: FontWeightNumber | FontWeightText | '' = ''
    export let lineHeight = ''
    export let secondary = false
    export let disabled = false
    export let highlighted = false
    export let bold = false
    export let smaller = false
    export let bigger = false
    export let error = false
    export let overrideColor = false
    export let color = ''
    export let darkColor = ''
    export let overrideLeading = false
    export let classes = '' // ISSUE: https://github.com/tailwindlabs/tailwindcss/discussions/1446

    const DARKMODE_PREFIX = 'dark:'
    const TEXT_PREFIX = 'text-'
    const LEADING_PREFIX = 'leading-'
    const DEFAULT_TEXT_COLOUR = TEXT_PREFIX + 'gray-800'
    const DEFAULT_TEXT_DARK_COLOUR = DARKMODE_PREFIX + TEXT_PREFIX + 'white'
    const ERROR_TEXT_COLOUR = TEXT_PREFIX + 'red-500'
    const DISABLED_TEXT_COLOUR = TEXT_PREFIX + 'gray-400'
    const DISABLED_TEXT_DARK_COLOUR = TEXT_PREFIX + 'gray-600'
    const HIGHLIGHT_TEXT_COLOUR = TEXT_PREFIX + 'blue-500'
    const SECONDARY_TEXT_COLOUR = TEXT_PREFIX + 'gray-500'

    interface ICustomClass {
        fontWeight: FontWeightNumber | FontWeightText
        color: string
        darkColor: string
        fontSize: string
        lineHeight: string
        wordBreak?: string
        whitespace?: string
        fontFamily?: string
    }

    const DEFAULT_CLASSES_LIST: { [key in TextType]: ICustomClass } = {
        [TextType.h1]: {
            fontWeight: FontWeightText.bold,
            color: DEFAULT_TEXT_COLOUR,
            darkColor: DEFAULT_TEXT_DARK_COLOUR,
            fontSize: 'text-32',
            lineHeight: 'leading-120',
        },
        [TextType.h2]: {
            fontWeight: FontWeightText.bold,
            color: DEFAULT_TEXT_COLOUR,
            darkColor: DEFAULT_TEXT_DARK_COLOUR,
            fontSize: 'text-24',
            lineHeight: 'leading-120',
        },
        [TextType.h3]: {
            fontWeight: FontWeightText.bold,
            color: DEFAULT_TEXT_COLOUR,
            darkColor: DEFAULT_TEXT_DARK_COLOUR,
            fontSize: 'text-18',
            lineHeight: 'leading-140',
        },
        [TextType.h4]: {
            fontWeight: FontWeightText.bold,
            color: DEFAULT_TEXT_COLOUR,
            darkColor: DEFAULT_TEXT_DARK_COLOUR,
            fontSize: 'text-16',
            lineHeight: 'leading-140',
        },
        [TextType.h5]: {
            fontWeight: FontWeightText.bold,
            color: DEFAULT_TEXT_COLOUR,
            darkColor: DEFAULT_TEXT_DARK_COLOUR,
            fontSize: 'text-14',
            lineHeight: 'leading-140',
        },
        [TextType.p]: {
            fontWeight: FontWeightText.normal,
            color: DEFAULT_TEXT_COLOUR,
            darkColor: DEFAULT_TEXT_DARK_COLOUR,
            fontSize: 'text-13',
            lineHeight: 'leading-160',
        },
        [TextType.pre]: {
            fontWeight: FontWeightText.normal,
            color: DEFAULT_TEXT_COLOUR,
            darkColor: DEFAULT_TEXT_DARK_COLOUR,
            fontSize: 'text-12',
            lineHeight: 'leading-140',
            wordBreak: 'break-all',
            whitespace: 'whitespace-pre-line',
            fontFamily: 'font-fira-mono',
        },
    }

    // Format custom inputs
    fontSize = fontSize ? TEXT_PREFIX + fontSize : ''
    lineHeight = lineHeight ? LEADING_PREFIX + lineHeight : ''
    color = color ? TEXT_PREFIX + color : ''
    darkColor = darkColor ? DARKMODE_PREFIX + TEXT_PREFIX + darkColor : ''

    // Adjust font for old override classes
    function adjustFont() {
        switch (type) {
            case TextType.p:
                fontSize = bigger ? 'text-16' : smaller ? 'text-12' : fontSize
                lineHeight = bigger ? 'leading-140' : smaller ? 'leading-120' : lineHeight
                break
            case TextType.pre:
                fontSize = bigger ? 'text-13' : smaller ? 'text-11' : fontSize
                break
        }

        fontWeight = bold ? FontWeightText.bold : fontWeight
        lineHeight = overrideLeading ? '' : lineHeight
    }
    $: smaller, bigger, adjustFont()

    // Adjust colours for old override classes
    function adjustColor() {
        color = overrideColor ? '' : color
        darkColor = overrideColor ? '' : darkColor

        if (error) {
            color = ERROR_TEXT_COLOUR
            darkColor = ERROR_TEXT_COLOUR
        } else if (disabled) {
            color = DISABLED_TEXT_COLOUR
            darkColor = DISABLED_TEXT_DARK_COLOUR
        } else if (highlighted) {
            color = HIGHLIGHT_TEXT_COLOUR
            darkColor = HIGHLIGHT_TEXT_COLOUR
        } else if (secondary) {
            color = SECONDARY_TEXT_COLOUR
            darkColor = SECONDARY_TEXT_COLOUR
        }
    }
    $: error, disabled, highlighted, secondary, adjustColor()

    let customClasses: ICustomClass
    $: customClasses = {
        ...DEFAULT_CLASSES_LIST[type],
        ...(fontSize && { fontSize }),
        ...(fontWeight && { fontWeight }),
        ...(lineHeight && { lineHeight }),
        ...(color && { color }),
        ...(darkColor && { darkColor }),
    }

    $: customClassesString = Object.values(customClasses).join(' ')
</script>

<svelte:element this={type} class={`${customClassesString} ${classes}`} {...$$restProps}>
    <slot />
</svelte:element>
