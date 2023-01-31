<script lang="ts">
    import { IAccountState } from '@core/account'
    import { Text, FontWeight, ColoredCircle } from 'shared/components/'

    export let account: IAccountState
    export let selected = true
</script>

<div class="flex flex-row items-center space-x-3">
    <ColoredCircle color={account?.color} />
    <Text fontSize="14" fontWeight={FontWeight.semibold} classes={selected ? '' : 'opacity-50'}>
        {account?.name}
    </Text>
</div>
