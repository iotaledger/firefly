<script lang="ts">
    import { Icon } from '@ui'
    import { NotVerifiedStatus, VerifiedStatus } from '@core/wallet'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let status: VerifiedStatus | NotVerifiedStatus
    export let width: number
    export let height: number
</script>

<verification-status-badge class="absolute -right-1 -bottom-1 flex items-center justify-center rounded-full">
    {#if status === NotVerifiedStatus.New || status === NotVerifiedStatus.Skipped}
        <Icon {width} {height} icon={IconEnum.VerificationStatusNew} classes="text-gray-600" secondaryColor="white" />
    {:else if status === VerifiedStatus.SelfVerified}
        <Icon {width} {height} icon={IconEnum.VerificationStatusSelf} secondaryColor="white" />
    {:else if status === VerifiedStatus.Official}
        <Icon
            {width}
            {height}
            icon={IconEnum.VerificationStatusOfficial}
            classes="text-verification-blue"
            secondaryColor="white"
        />
    {/if}
</verification-status-badge>
