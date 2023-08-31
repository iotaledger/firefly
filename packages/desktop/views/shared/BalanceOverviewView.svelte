<script lang="ts">
    import { AnimationEnum } from '@auxiliary/animation'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { OnboardingLayout } from '@components'
    import { localize } from '@core/i18n'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { Animation, Button, HTMLButtonType, Icon, Text, TextHint, TextHintVariant, TextType, Tile } from '@ui'

    export let busy: boolean = false
    export let onContinueClick: () => void

    // TODO: Replace this mocked data with real one
    const DUMMY_LIST_OF_ALL_WALLETS = [
        {
            name: 'Wallet 1',
            balance: '1400 MIOTA',
        },
        {
            name: 'Wallet 2',
            balance: '2050 MIOTA',
        },
        {
            name: 'Wallet 3',
            balance: '3000 MIOTA',
        },
    ]

    $: totalBalance = DUMMY_LIST_OF_ALL_WALLETS.reduce((acc, curr) => acc + parseInt(curr.balance), 0)
</script>

<OnboardingLayout {...$$restProps}>
    <div slot="title">
        <Text type={TextType.h2}>{localize('views.onboarding.balanceOverview.title')}</Text>
    </div>
    <div slot="leftpane__content" class="balance-overview-wrapper">
        <div class="flex flex-col mb-8 space-y-4">
            <Text secondary>{localize('views.onboarding.balanceOverview.description')}</Text>
            <VirtualList items={DUMMY_LIST_OF_ALL_WALLETS} let:item>
                <div class="mb-2">
                    <Tile classes="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-1000">
                        <div class="flex items-center space-x-2">
                            <Icon icon={IconEnum.Wallet} width={28} height={28} classes="text-blue-500" />
                            <Text classes="text-right">{item.name}</Text>
                        </div>
                        <Text classes="text-right">{item.balance}</Text>
                    </Tile>
                </div>
            </VirtualList>
            <Tile isGhost classes="flex justify-between">
                <Text type={TextType.h5}>{localize('views.onboarding.balanceOverview.total')}:</Text>
                <Text type={TextType.h5}>{totalBalance} MIOTA</Text>
            </Tile>
            <TextHint
                variant={TextHintVariant.Info}
                icon={IconEnum.Exclamation}
                text={localize('popups.walletFinder.searchAgainHint')}
            />
            <Button type={HTMLButtonType.Button} on:click={onContinueClick}>
                {localize('actions.searchAgain')}
            </Button>
        </div>
    </div>
    <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button
            classes="flex-1"
            type={HTMLButtonType.Submit}
            form="setup-pin"
            isBusy={busy}
            busyMessage={`${localize('actions.initializing')}...`}
            onClick={onContinueClick}
        >
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-pink dark:bg-gray-900">
        <Animation animation={AnimationEnum.BalanceDesktop} />
    </div>
</OnboardingLayout>

<style lang="scss">
    .balance-overview-wrapper :global(svelte-virtual-list-viewport) {
        margin-right: -1rem !important;
        flex: auto;
        overflow-y: scroll;
        padding-right: 1.5rem !important;
        min-height: 100px;
        max-height: 300px;
    }
    .balance-overview-wrapper :global(svelte-virtual-list-contents) {
        margin-right: -1rem !important;
    }
</style>
