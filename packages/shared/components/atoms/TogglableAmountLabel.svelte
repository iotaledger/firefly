<script lang="typescript">
    import { Text } from 'shared/components'
    import { TextType } from 'shared/components/Text.svelte'
    import { ITokenMetadata, formatBestMatchTokenAmount, formatPreciseTokenAmount } from '@core/assets'

    export let amount = 0
    export let tokenMetadata: ITokenMetadata

    let showPreciseValue = false
    function togglePreciseValue() {
        showPreciseValue = !showPreciseValue
    }
</script>

{#if amount}
    <button on:click={togglePreciseValue}>
        <Text type={TextType.h2}>
            {showPreciseValue
                ? formatPreciseTokenAmount(amount, tokenMetadata)
                : formatBestMatchTokenAmount(amount, tokenMetadata)}
        </Text>
    </button>
{/if}
