<script lang="typescript">
    import { Animation, Button, Link, Logo, OnboardingLayout, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { SetupType } from 'shared/lib/typings/routes'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    function handleContinueClick(setupType) {
        dispatch('next', { setupType })
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2">{locale('views.setup.title')}</Text>
            <div class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-16 p-8 pt-16">
                <div class="absolute -top-14">
                    <Logo width="auto" height="auto" logo="logo-chrysalis-gem" />
                </div>
                <Text type="h3" classes="mb-6 text-center">{locale('views.setup.chrysalisTitle')}</Text>
                <Text type="p" secondary classes="mb-8">{locale('views.setup.chrysalisBody')}</Text>
                <Link onClick={() => Electron.openUrl('https://blog.iota.org/firefly-token-migration/')}>
                    {locale('views.setup.learnMore')}
                </Link>
            </div>
        </div>
        <div slot="leftpane__action" class="flex flex-col space-y-4">
            <Button icon="plus" classes="w-full" secondary onClick={() => handleContinueClick(SetupType.New)}>
                {locale('actions.createWallet')}
                <Text type="p" secondary smaller>{locale('actions.createWalletDescription')}</Text>
            </Button>
            <Button icon="transfer" classes="w-full" secondary onClick={() => handleContinueClick(SetupType.Import)}>
                {locale('actions.restoreWallet')}
                <Text type="p" secondary smaller>{locale('actions.restoreWalletDescription')}</Text>
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
            <Animation animation="setup-desktop" />
        </div>
    </OnboardingLayout>
{/if}
