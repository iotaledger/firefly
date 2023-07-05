<script lang="ts">
    import { Text, FontWeight, TextType, PillBorderRadius } from 'shared/components'

    export let data: string | undefined = undefined
    export let textColor: string = 'gray-800'
    export let darkTextColor: string | undefined = undefined
    export let shrink: boolean = false
    export let uppercase: boolean = false
    export let invisible: boolean = false
    export let backgroundColor: string | undefined = undefined
    export let borderRadius: PillBorderRadius = PillBorderRadius['2xl']
</script>

<pill-wrapper
    class:shrink-0={shrink}
    class:uppercase
    class:invisible
    class="flex items-center {backgroundColor ?? ''} {borderRadius} px-2.5 py-1"
>
    <Text
        type={TextType.p}
        smaller
        fontWeight={FontWeight.semibold}
        color={textColor}
        darkColor={darkTextColor || textColor}
    >
        {#if data}
            <slot />
            {data}
        {:else}
            <slot />
        {/if}
    </Text>
</pill-wrapper>
