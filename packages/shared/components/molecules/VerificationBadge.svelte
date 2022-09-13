<script lang="typescript">
    import { Icon as Icons } from '@auxiliary/icon'
    import { NotVerifiedStatus, VerifiedStatus } from '@core/wallet'
    import { Icon } from 'shared/components'

    export let status: VerifiedStatus | NotVerifiedStatus
    export let large = false
</script>

{#if status === NotVerifiedStatus.New}
    <Icon
        width={large ? 20 : 14}
        height={large ? 20 : 14}
        icon={Icons.NotVerified}
        classes="text-gray-600"
        secondaryColor="white"
    />
{:else if status === VerifiedStatus.Official}
    <Icon
        width={large ? 20 : 14}
        height={large ? 20 : 14}
        icon={Icons.Verified}
        classes="text-verification-blue"
        secondaryColor="white"
    />
{:else if status === VerifiedStatus.SelfVerified}
    <Icon
        width={large ? 20 : 14}
        height={large ? 20 : 14}
        icon={Icons.Verified}
        classes="text-verification-blue"
        secondaryColor="white"
    />
{/if}
