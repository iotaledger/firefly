<script lang="ts">
    import { Icon } from 'shared/components'
    import { NotVerifiedStatus, VerifiedStatus } from '@core/wallet'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let status: VerifiedStatus | NotVerifiedStatus
    export let large = false
</script>

{#if status === NotVerifiedStatus.New}
    <Icon
        width={large ? 20 : 14}
        height={large ? 20 : 14}
        icon={IconEnum.VerificationStatusNew}
        classes="text-gray-600"
        secondaryColor="white"
    />
{:else if status === VerifiedStatus.SelfVerified}
    <Icon
        width={large ? 20 : 14}
        height={large ? 20 : 14}
        icon={IconEnum.VerificationStatusSelf}
        secondaryColor="white"
    />
{:else if status === VerifiedStatus.Official}
    <Icon
        width={large ? 20 : 14}
        height={large ? 20 : 14}
        icon={IconEnum.VerificationStatusOfficial}
        classes="text-verification-blue"
        secondaryColor="white"
    />
{/if}
