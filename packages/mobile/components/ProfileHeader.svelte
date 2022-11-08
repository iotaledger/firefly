<script lang="typescript">
    import { activeProfile, logout } from '@core/profile'
    import { getInitials } from '@core/utils'
    import { Icon as IconTypes } from '@lib/auxiliary/icon'
    import { FontWeight, Icon, NetworkIcon, Text, TextType } from 'shared/components'

    const networkProtocol = $activeProfile.networkProtocol
    const initials = getInitials($activeProfile.name, 1)
</script>

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
        <button class="inline-flex p-1" on:click={() => logout()}>
            <Icon width="16" height="16" icon={IconTypes.Logout} classes="text-blue-500 my-auto" />
            <Text type={TextType.p} overrideColor classes="text-blue-500 pl-1">Logout</Text>
        </button>
    </div>
</div>
