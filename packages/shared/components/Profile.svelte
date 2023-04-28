<script lang="ts">
    import { DeveloperIndicatorPill, Icon, NetworkIconBadge, StrongholdBadge, Text, TextType } from '@ui'

    import { IPersistedProfile, ProfileType } from '@core/profile'
    import { getInitials as _getInitials } from '@core/utils'

    import { Icon as IconEnum } from '@auxiliary/icon/enums'

    export let profile: IPersistedProfile
    export let classes: string = undefined
    export let bgColor: string = ''
    export let updateRequired: boolean = false

    export let onClick: undefined | ((profileId: string) => void) = undefined

    const slots = $$props.$$slots

    function onProfileClick(): void {
        onClick && onClick(profile?.id)
    }

    function getInitials(): string {
        const initials = _getInitials(profile.name, 1)
        if (initials.length === 1) {
            return initials
        } else {
            const letters = initials.split('')
            return letters[0] + letters[letters.length - 1]
        }
    }
</script>

<profile-container class="flex items-center justify-center w-24">
    <div class="flex flex-col justify-between items-center w-full">
        <button type="button" on:click={onProfileClick} class="relative cursor-pointer mb-3">
            <div
                class="h-18 w-18 rounded-full font-bold text-center flex items-center justify-center
                {bgColor ? `bg-${bgColor}-500` : ''} {classes}"
            >
                {#if slots}
                    <slot />
                {:else}
                    <Text type={TextType.h3} classes="text-white">{getInitials()}</Text>
                {/if}
            </div>
            {#if !updateRequired}
                <NetworkIconBadge network={profile?.network} />
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
