<script lang="typescript">
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { Text, CopyableBox } from 'shared/components'

    export let address = ''
    export let isCopyable = false
    export let fontSize = 'base'

    let copyableBoxElement: CopyableBox

    export function copyAddress(): void {
        copyableBoxElement.onClick()
    }
</script>

{#if address}
    <CopyableBox bind:this={copyableBoxElement} col {isCopyable} value={address} {...$$restProps}>
        <Text type="pre" {fontSize} fontWeight={FontWeightText.medium}>
            {address.slice(0, address.length / 2)}
        </Text>
        <Text type="pre" {fontSize} fontWeight={FontWeightText.medium}>
            {address.slice(address.length / 2)}
        </Text>
    </CopyableBox>
{/if}
