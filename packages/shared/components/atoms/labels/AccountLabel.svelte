<script lang="typescript">
    import { IAccountState } from '@core/account'
    import { Text } from 'shared/components/'
    import { FontWeight } from 'shared/components/Text.svelte'

    export let account: IAccountState
    export let selected = true
</script>

<div class="flex flex-row items-center space-x-3">
    <div class="circle" style="--account-color: {account?.color};" />
    <Text fontSize="14" fontWeight={FontWeight.semibold} classes={selected ? '' : 'opacity-50'}>
        {account?.name}
    </Text>
</div>

<style type="text/scss">
    .circle {
        @apply relative;
        @apply rounded-full;
        @apply w-3;
        @apply h-3;
        background-color: var(--account-color);
        &:after {
            @apply absolute;
            @apply rounded-full;
            @apply w-3;
            @apply h-3;
            @apply border;
            @apply border-solid;
            @apply border-gray-700;
            @apply bg-transparent;
            @apply opacity-10;
            @apply top-1/2;
            @apply left-1/2;
            @apply transform;
            @apply -translate-x-1/2;
            @apply -translate-y-1/2;
            content: '';
        }
    }
</style>
