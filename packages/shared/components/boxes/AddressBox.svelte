<script lang="ts">
    import { Text, CopyableBox, FontWeight, TextType } from '@ui'

    export let address: string = ''
    export let isCopyable: boolean = false
    export let fontSize: string = 'base'

    let copyableBoxElement: CopyableBox

    export function copyAddress(): void {
        copyableBoxElement.onClick()
    }
</script>

{#if address}
    <CopyableBox bind:this={copyableBoxElement} col {isCopyable} value={address} clearBoxPadding {...$$restProps}>
        {#if address.length > 20}
            <Text type={TextType.pre} {fontSize} fontWeight={FontWeight.medium}>
                {address.slice(0, address.length / 2)}
            </Text>
            <Text type={TextType.pre} {fontSize} fontWeight={FontWeight.medium}>
                {address.slice(address.length / 2)}
            </Text>
        {:else}
            <Text type={TextType.pre} {fontSize} fontWeight={FontWeight.medium}>
                {address}
            </Text>
        {/if}
    </CopyableBox>
{/if}
