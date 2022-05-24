<script lang="typescript">
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { Text } from 'shared/components'

    export let leftPrimaryText = ''
    export let leftPrimaryColor = 'gray-800'
    export let leftPrimaryFontSize = '15'
    export let leftPrimaryFontWeight: FontWeightText.normal
    export let leftPrimaryLineHeight = '20'

    export let leftSecondaryText = ''
    export let leftSecondaryColor = 'gray-600'
    export let leftSecondaryFontSize = '13'
    export let leftSecondaryFontWeight = FontWeightText.medium
    export let leftSecondaryLineHeight = '16'

    export let rightPrimaryText = ''
    export let rightPrimaryColor = 'gray-800'
    export let rightPrimaryFontSize = '15'
    export let rightPrimaryFontWeight = FontWeightText.normal
    export let rightPrimaryLineHeight = '20'

    export let rightSecondaryText = ''
    export let rightSecondaryColor = 'gray-600'
    export let rightSecondaryFontSize = '13'
    export let rightSecondaryFontWeight = FontWeightText.medium
    export let rightSecondaryLineHeight = '16'
</script>

<div class="flex justify-between">
    <div class={leftSecondaryText ? 'flex flex-col space-y-0.5' : ''}>
        <Text
            color={leftPrimaryColor}
            fontSize={leftPrimaryFontSize}
            fontWeight={leftPrimaryFontWeight}
            lineHeight={leftPrimaryLineHeight}>{leftPrimaryText}</Text
        >
        {#if leftSecondaryText}
            <Text
                color={leftSecondaryColor}
                fontSize={leftSecondaryFontSize}
                fontWeight={leftSecondaryFontWeight}
                lineHeight={leftSecondaryLineHeight}>{leftSecondaryText}</Text
            >
        {/if}
    </div>
    <div class={rightSecondaryText ? 'flex flex-col items-end space-y-0.5' : ''}>
        <Text
            color={rightPrimaryColor}
            fontSize={rightPrimaryFontSize}
            fontWeight={rightPrimaryFontWeight}
            lineHeight={rightPrimaryLineHeight}>{rightPrimaryText}</Text
        >
        {#if rightSecondaryText}
            <Text
                color={rightSecondaryColor}
                fontSize={rightSecondaryFontSize}
                fontWeight={rightSecondaryFontWeight}
                lineHeight={rightSecondaryLineHeight}>{rightSecondaryText}</Text
            >
        {/if}
    </div>
</div>
