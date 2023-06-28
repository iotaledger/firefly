<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon/enums'
    import { IPersistedProfile, ProfileType } from '@core/profile'
    import {
        DeveloperIndicatorPill,
        Icon,
        NetworkIconBadge,
        ProfilePicture,
        StrongholdBadge,
        Text,
        TextType,
    } from '@ui'

    export let profile: IPersistedProfile
    export let updateRequired: boolean = false
    export let onClick: undefined | ((profileId: string) => void) = undefined

    function onProfileClick(): void {
        onClick && onClick(profile?.id)
    }
</script>

<profile-container class="flex items-center justify-center w-24">
    <div class="flex flex-col justify-between items-center w-full">
        <button
            type="button"
            on:click={onProfileClick}
            disabled={!onClick}
            class="relative mb-3 {onClick ? 'cursor-pointer' : 'cursor-default'}"
        >
            <ProfilePicture {profile} size="large" />
            {#if !updateRequired}
                <NetworkIconBadge networkId={profile?.network?.id} tooltipText={profile?.network?.name} />
            {:else}
                <StrongholdBadge />
            {/if}
        </button>
        <div class="flex flex-row items-baseline justify-center space-x-1.5 mb-2 w-full">
            {#if profile?.type === ProfileType.Ledger}
                <Icon
                    icon={IconEnum.Ledger}
                    classes="text-gray-900 dark:text-gray-100 relative top-0.5"
                    width={14}
                    height={14}
                />
            {/if}
            {#if profile?.name}
                <Text type={TextType.h5} classes="text-center truncate">{profile?.name}</Text>
            {/if}
        </div>
        {#if profile?.isDeveloperProfile}
            <DeveloperIndicatorPill />
        {/if}
    </div>
</profile-container>
