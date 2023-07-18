<script lang="ts">
    import { Text, CopyableBox, FontWeight } from 'shared/components'

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
        {#if address.length > 20}
            <Text type="pre" {fontSize} fontWeight={FontWeight.medium}>
                {address.slice(0, address.length / 2)}
            </Text>
            <Text type="pre" {fontSize} fontWeight={FontWeight.medium}>
                {address.slice(address.length / 2)}
            </Text>
        {:else}
            <Text type="pre" {fontSize} fontWeight={FontWeight.medium}>
                {address}
            </Text>
        {/if}
    </CopyableBox>
{/if}
