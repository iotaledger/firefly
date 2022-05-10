<script lang="typescript">
    import { IProfile } from '@core/profile'
    import { WalletAccount } from '@lib/typings/walletAccount'
    import { getColor } from 'shared/lib/profile'
    import { Text } from 'shared/components/'
    import { FontWeightText } from 'shared/components/Text.svelte'

    export let profile: IProfile
    export let account: WalletAccount
</script>

<div class="flex flex row items-center space-x-3">
    <div class="circle" style="--account-color: {getColor(profile, account?.id)};" />
    <Text type="p" fontSize="base" fontWeight={FontWeightText.medium}>{account?.alias()}</Text>
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
