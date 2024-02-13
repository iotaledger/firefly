<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        Modal,
        MeatballMenuButton,
        Height,
        Pane,
        TextType,
        Text,
        Tile,
        FontWeight,
        CopyableBox,
        Icon,
        Pill,
    } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { AccountManagementMenu } from './modals'

    let modal: Modal

    const DUMMY_ACCOUNT_DATA = {
        id: '1',
        tiles: [
            {
                title: localize('views.accountManagement.details.balance'),
                amount: '12 Gi',
            },
            {
                title: localize('views.accountManagement.details.staked'),
                amount: '0i',
            },
        ],
        address: {
            title: localize('views.accountManagement.details.address'),
            value: '0xba6a556cfdb7c6a66a45ee520e529c2ea6c526dd27f364865bc0d1167f41c819',
        },
        info: [
            {
                title: localize('views.accountManagement.details.mana'),
                value: '120000',
            },
            {
                title: localize('views.accountManagement.details.key'),
                value: '7f364865bc0d1167f41c819',
            },
        ],
    }
</script>

<right-pane class="w-full h-full min-h-96 flex-1 space-y-4 flex flex-col">
    <Pane height={Height.Full}>
        <right-pane-container class="flex flex-col space-y-10 h-full">
            <title-container class="flex justify-between w-full">
                <title-wrapper class="flex items-center space-x-2">
                    <Text type={TextType.h2}>{localize('views.accountManagement.list.tile.title')}</Text>
                    <Pill backgroundColor="blue-200" textColor="blue-600"
                        >{localize('views.accountManagement.list.tile.pill.main')}
                    </Pill>
                </title-wrapper>
                <wallet-actions-button class="block relative">
                    <MeatballMenuButton onClick={modal?.toggle} />
                    <AccountManagementMenu bind:modal position={{ right: '0' }} classes="mt-1.5" />
                </wallet-actions-button>
            </title-container>
            <div class="flex flex-row space-x-2 w-1/2">
                {#each DUMMY_ACCOUNT_DATA.tiles as tile}
                    <Tile>
                        <div class="flex flex-col space-y-2 items-center justify-center w-full">
                            <Text type={TextType.h3}>{tile.amount}</Text>
                            <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}
                                >{tile.title}</Text
                            >
                        </div>
                    </Tile>
                {/each}
            </div>
            <div class="flex flex-col space-y-2 w-1/2">
                <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}
                    >{DUMMY_ACCOUNT_DATA.address.title}</Text
                >
                <CopyableBox
                    clearBackground
                    clearBoxPadding
                    isCopyable
                    value={DUMMY_ACCOUNT_DATA.address.value}
                    classes="flex space-x-2 items-center"
                >
                    <Text type={TextType.pre} fontSize="13" lineHeight="leading-120" classes="text-start w-[260px]"
                        >{DUMMY_ACCOUNT_DATA.address.value}</Text
                    >
                    <Icon icon={IconEnum.Copy} classes="text-blue-500" width={24} height={24} />
                </CopyableBox>
            </div>
            {#each DUMMY_ACCOUNT_DATA.info as info}
                <div class="flex flex-col space-y-2 w-1/2">
                    <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}
                        >{info.title}</Text
                    >
                    <Text type={TextType.pre} fontSize="13" lineHeight="leading-120" classes="text-start w-[260px]"
                        >{info.value}</Text
                    >
                </div>
            {/each}
        </right-pane-container>
    </Pane>
</right-pane>
