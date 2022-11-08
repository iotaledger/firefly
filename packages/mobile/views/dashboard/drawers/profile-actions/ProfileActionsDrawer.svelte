<script lang="typescript">
    import { Drawer } from '../../../../components'
    import { Icon, NetworkIcon, Text, FontWeight, TextType } from 'shared/components'
    import { Icon as IconTypes } from '@lib/auxiliary/icon'
    import { getInitials as _getInitials } from '@core/utils'
    import { activeProfile, logout } from '@core/profile'

    export let onClose: () => unknown = () => {}

    const title: string = 'Profile'
    const allowBack: boolean = true

    const fullScreen: boolean = true
    const networkProtocol = $activeProfile.networkProtocol

    function getInitials() {
        const initials = _getInitials($activeProfile.name, 1)
        if (initials.length === 1) {
            return initials
        } else {
            const letters = initials.split('')
            return letters[0] + letters[letters.length - 1]
        }
    }
</script>

<Drawer {onClose} {title} {fullScreen} {allowBack} enterFromSide={true} onBackClick={onClose}>
    <div class="flex flex-col">
        <div class="flex flex-row justify-center">
            <div class="relative">
                <div class="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
                    <Text type={TextType.h5} classes="text-white">{getInitials()}</Text>
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
</Drawer>
