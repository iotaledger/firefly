<script lang="typescript">
    import { ITokenMetadata } from '@core/wallet'
    import { Text, TextType, FontWeight } from '@ui'

    export let tokenMetadata: ITokenMetadata
    export let selectedUnit: string
    export let onClick: undefined | ((unit: string) => void) = undefined

    let unitSwapper: string = null
    $: if (!tokenMetadata?.useMetricPrefix && tokenMetadata?.unit) {
        if (selectedUnit === tokenMetadata.unit) {
            unitSwapper = tokenMetadata?.subunit
        } else if (selectedUnit === tokenMetadata?.subunit) {
            unitSwapper = tokenMetadata?.unit
        }
    }

    function handleOnClick(): void {
        onClick && onClick(unitSwapper)
    }
</script>

{#if unitSwapper}
    <div
        class="w-10 h-10 flex items-center justify-center rounded-full p-2 bg-gray-50 dark:bg-gray-700 "
        on:click={handleOnClick}
    >
        <Text type={TextType.p} smaller fontWeight={FontWeight.semibold} color="gray-600">{unitSwapper}</Text>
    </div>
{/if}
