<script lang="typescript">
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { Text, CopyableBox } from 'shared/components'

    export let address = ''
    export let isCopyable = false
</script>

{#if address}
    <CopyableBox col {isCopyable} value={address} {...$$restProps}>
        <Text type="pre" fontSize="base" fontWeight={FontWeightText.medium}>
            {address.slice(0, address.length / 2)}
        </Text>
        <Text type="pre" fontSize="base" fontWeight={FontWeightText.medium}>
            {address.slice(address.length / 2)}
        </Text>
    </CopyableBox>
{/if}
