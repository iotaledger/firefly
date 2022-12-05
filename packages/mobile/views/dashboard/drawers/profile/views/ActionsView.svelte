<script lang="typescript">
    import { localize } from '@core/i18n'
    import { NetworkProtocol } from '@core/network'
    import { activeProfile, logout } from '@core/profile'
    import { getInitials } from '@core/utils'
    import { Icon as IconTypes } from '@lib/auxiliary/icon'
    import { FontWeight, Icon, NetworkIcon, Text, TextType } from 'shared/components'
    import { profileRouter } from '../../../../../lib/routers'
    import features from '@features/features'

    let networkProtocol: NetworkProtocol
    $: networkProtocol = $activeProfile.networkProtocol

    let initials: string
    $: initials = getInitials($activeProfile.name, 1)

    function handleLogoutClick(): void {
        void logout()
    }
</script>

{#if $activeProfile?.id}
    <div class="flex flex-col">
        <div class="flex flex-row justify-center">
            <div class="relative">
                <div class="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
                    <Text type={TextType.h5} classes="text-white">{initials}</Text>
                </div>
                <div class="absolute right-0 bottom-0">
                    <NetworkIcon {networkProtocol} height={14} width={14} />
                </div>
            </div>
        </div>
        <Text
            type={TextType.h4}
            color="gray-800"
            darkColor="white"
            fontWeight={FontWeight.semibold}
            lineHeight="5"
            classes="text-center pt-4"
        >
            {$activeProfile.name}
        </Text>
        <div class="flex justify-center">
            <button class="inline-flex p-1" on:click={handleLogoutClick}>
                <Icon width="16" height="16" icon={IconTypes.Logout} classes="text-blue-500 my-auto" />
                <Text type={TextType.p} overrideColor classes="text-blue-500 pl-1">
                    {localize('views.dashboard.profileModal.logout')}
                </Text>
            </button>
        </div>
    </div>
{/if}
{#if features?.profileActions?.settings?.enabled}
    <button on:click={$profileRouter.next({ settings: true })}>Settings</button>
{/if}
