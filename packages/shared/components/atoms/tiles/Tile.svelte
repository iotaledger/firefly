<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { FontWeightText } from 'shared/components/Text.svelte'

    export let applyBorder = false

    export let icon = ''
    export let iconColor = ''
    export let iconBackgroundColor = ''
    export let iconLabel = ''
    export let iconLabelFontWeight = FontWeightText.semibold
    export let iconSubLabel = ''
    export let iconSubLabelFontWeight = FontWeightText.normal
    export let tileText = ''
    export let tileTextFontWeight = FontWeightText.semibold
    export let tileSubText = ''
    export let tileSubTextFontWeight = FontWeightText.normal
</script>

<div
    class="w-full p-4 rounded-2xl flex flex-row justify-between items-center {applyBorder
        ? 'border border-solid border-gray-300 dark:border-gray-700'
        : ''}"
>
    <div class="flex flex-row items-center">
        {#if icon}
            {#if iconBackgroundColor}
                <div
                    class="icon-bg bg-{iconBackgroundColor} w-8 h-8 p-1 rounded-full flex justify-center items-center {iconLabel
                        ? 'mr-4'
                        : ''}"
                    style="--icon-bg-color: {iconBackgroundColor}"
                >
                    <Icon
                        {icon}
                        width="100%"
                        height="100%"
                        classes="text-{iconColor ? iconColor : 'blue-500'} text-center"
                    />
                </div>
            {:else}
                <Icon
                    {icon}
                    width="24"
                    height="24"
                    classes="{iconLabel ? 'mr-4' : ''} text-{iconColor ? iconColor : 'blue-500'}"
                />
            {/if}
        {/if}
        {#if iconLabel}
            <div class="flex flex-col">
                <Text type="p" fontWeight={iconLabelFontWeight}>{iconLabel}</Text>
                {#if iconSubLabel}
                    <div class="flex flex-row justify-between items-center">
                        <Text type="p" secondary fontWeight={iconSubLabelFontWeight} smaller>{iconSubLabel}</Text>
                        <slot name="subLabel" />
                    </div>
                {/if}
            </div>
        {/if}
    </div>
    {#if tileText}
        <div class="flex flex-col text-right">
            <Text type="p" fontWeight={tileTextFontWeight}>{tileText}</Text>
            {#if tileSubText}
                <div class="flex flex-row justify-between items-center">
                    <slot name="subText" />
                    <Text type="p" secondary fontWeight={tileSubTextFontWeight} smaller>{tileSubText}</Text>
                </div>
            {/if}
        </div>
    {/if}
</div>

<style type="text/scss">
    .icon-bg {
        background-color: var(--icon-bg-color);
    }
</style>
