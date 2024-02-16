<script lang="ts">
    import { Text, FontWeight, ColoredCircle } from '@ui/'
    import { IWalletState } from '@core/wallet'

    export let wallet: IWalletState
    export let selected = true
</script>

<div class="flex flex-row items-center space-x-3">
    <ColoredCircle color={wallet?.color} />
    <Text fontSize="14" fontWeight={FontWeight.semibold} classes={selected ? '' : 'opacity-50'}>
        {wallet?.name}
    </Text>
</div>
