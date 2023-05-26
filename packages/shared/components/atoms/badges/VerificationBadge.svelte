<script lang="ts">
    import { Icon } from 'shared/components'
    import { NotVerifiedStatus, VerifiedStatus } from '@core/wallet'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let status: VerifiedStatus | NotVerifiedStatus
    export let width: number
    export let height: number
</script>

<verification-status-badge
    class="absolute -right-1 -bottom-1 flex items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-900"
>
    {#if status === NotVerifiedStatus.New}
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
