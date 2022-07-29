<script lang="typescript">
    import { Icon as Icons } from '@auxiliary/icon'
    import { VerificationStatus } from '@core/wallet'
    import { Icon } from 'shared/components'

    export let verificationStatus: VerificationStatus
    export let large = false
</script>

{#if verificationStatus === VerificationStatus.New}
    <Icon
        width={large ? 20 : 14}
        height={large ? 20 : 14}
        icon={Icons.NotVerified}
        classes="text-gray-600"
        secondaryColor="white"
    />
{:else if verificationStatus === VerificationStatus.Verified}
    <Icon
        width={large ? 20 : 14}
        height={large ? 20 : 14}
        icon={Icons.Verified}
        classes="text-verification-blue"
        secondaryColor="white"
    />
{/if}
