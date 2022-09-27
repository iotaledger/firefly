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

    export enum FontWeight {
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
        fontWeight?: FontWeight | ''
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
</script>

<script lang="typescript">
    export let type: TextType = TextType.p
    export let fontSize = ''
    export let fontWeight: FontWeight | '' = ''
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
        fontWeight: FontWeight
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
            fontWeight: FontWeight.bold,
            color: DEFAULT_TEXT_COLOUR,
            darkColor: DEFAULT_TEXT_DARK_COLOUR,
            fontSize: 'text-32',
            lineHeight: 'leading-120',
        },
        [TextType.h2]: {
            fontWeight: FontWeight.bold,
            color: DEFAULT_TEXT_COLOUR,
            darkColor: DEFAULT_TEXT_DARK_COLOUR,
            fontSize: 'text-24',
            lineHeight: 'leading-120',
        },
        [TextType.h3]: {
            fontWeight: FontWeight.bold,
            color: DEFAULT_TEXT_COLOUR,
            darkColor: DEFAULT_TEXT_DARK_COLOUR,
            fontSize: 'text-18',
            lineHeight: 'leading-140',
        },
        [TextType.h4]: {
            fontWeight: FontWeight.bold,
            color: DEFAULT_TEXT_COLOUR,
            darkColor: DEFAULT_TEXT_DARK_COLOUR,
            fontSize: 'text-16',
            lineHeight: 'leading-140',
        },
        [TextType.h5]: {
            fontWeight: FontWeight.bold,
            color: DEFAULT_TEXT_COLOUR,
            darkColor: DEFAULT_TEXT_DARK_COLOUR,
            fontSize: 'text-14',
            lineHeight: 'leading-140',
        },
        [TextType.p]: {
            fontWeight: FontWeight.normal,
            color: DEFAULT_TEXT_COLOUR,
            darkColor: DEFAULT_TEXT_DARK_COLOUR,
            fontSize: 'text-13',
            lineHeight: 'leading-160',
        },
        [TextType.pre]: {
            fontWeight: FontWeight.normal,
            color: DEFAULT_TEXT_COLOUR,
            darkColor: DEFAULT_TEXT_DARK_COLOUR,
            fontSize: 'text-12',
            lineHeight: 'leading-140',
            wordBreak: 'break-all',
            whitespace: 'whitespace-pre-line',
            fontFamily: 'font-fira-mono',
        },
    }

    $: formattedFontSize = fontSize ? TEXT_PREFIX + fontSize : ''
    $: formattedLineHeight = lineHeight ? LEADING_PREFIX + lineHeight : ''
    $: formattedColor = color ? TEXT_PREFIX + color : ''
    $: formattedDarkColor = darkColor ? DARKMODE_PREFIX + TEXT_PREFIX + darkColor : ''

    let _fontSize
    let _lineHeight
    let _color
    let _darkColor

    // Format custom inputs
    function setCustomStyles() {
        _fontSize = formattedFontSize
        _lineHeight = formattedLineHeight
        _color = formattedColor
        _darkColor = formattedDarkColor
    }

    // Adjust font for old override classes
    function adjustFont() {
        switch (type) {
            case TextType.p:
                _fontSize = bigger ? 'text-16' : smaller ? 'text-12' : _fontSize
                _lineHeight = bigger ? 'leading-140' : smaller ? 'leading-120' : _lineHeight
                break
            case TextType.pre:
                _fontSize = bigger ? 'text-13' : smaller ? 'text-11' : _fontSize
                break
            case TextType.h5:
                _fontSize = bigger ? 'text-15' : smaller ? 'text-13' : _fontSize
                break
        }

        fontWeight = bold ? FontWeight.bold : fontWeight
        _lineHeight = overrideLeading ? '' : _lineHeight
    }

    // Adjust colours for old override classes
    function adjustColor() {
        _color = overrideColor ? '' : _color
        _darkColor = overrideColor ? '' : _darkColor

        if (error) {
            _color = ERROR_TEXT_COLOUR
            _darkColor = ERROR_TEXT_COLOUR
        } else if (disabled) {
            _color = DISABLED_TEXT_COLOUR
            _darkColor = DISABLED_TEXT_DARK_COLOUR
        } else if (highlighted) {
            _color = HIGHLIGHT_TEXT_COLOUR
            _darkColor = HIGHLIGHT_TEXT_COLOUR
        } else if (secondary) {
            _color = SECONDARY_TEXT_COLOUR
            _darkColor = SECONDARY_TEXT_COLOUR
        }
    }

    $: $$props, setCustomStyles(), adjustFont(), adjustColor()

    let customClasses: ICustomClass
    $: customClasses = {
        ...DEFAULT_CLASSES_LIST[type],
        ...(_fontSize && { fontSize: _fontSize }),
        ...(fontWeight && { fontWeight }),
        ...(_lineHeight && { lineHeight: _lineHeight }),
        ...((overrideColor || _color) && { color: _color }),
        ...((overrideColor || _darkColor) && { darkColor: _darkColor }),
    }

    let customClassesString: string
    $: customClassesString = Object.values(customClasses).join(' ')
</script>

<svelte:element this={type} class={`${customClassesString} ${classes}`} {...$$restProps}>
    <slot />
</svelte:element>
