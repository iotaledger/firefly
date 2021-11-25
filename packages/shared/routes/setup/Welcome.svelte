<script lang="typescript">
    import { Animation, Button, Dropdown, Logo, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { locales, setLanguage, _ } from 'shared/lib/i18n'
    import { createEventDispatcher, onMount, onDestroy } from 'svelte'

    const actorId = 'testActor'
    let walletListener

    onMount(async () => {
        if (Capacitor) {
            const { WalletPlugin } = Capacitor.Plugins
            
            // Subscribe to wallet response events
            walletListener = WalletPlugin.addListener(
                'walletEvent', 
                response => alert(JSON.stringify(response))
            )
            
            //await WalletPlugin.destroy({ actorId })
            WalletPlugin.initialize({ actorId })
            
            await WalletPlugin.listen({
                actorId,
                id: '',
                event: 'ErrorThrown'
            })
            
            await WalletPlugin.sendMessage({
                payload: {
                    actorId,
                    id: '987123',
                    cmd: 'SetStrongholdPassword',
                    payload: 'testpass'
                }
            })
            // await WalletPlugin.sendMessage({
            //     payload: {
            //         actorId,
            //         id: '121112',
            //         cmd: 'GenerateMnemonic'
            //     }
            // })
            let mnemonic = 'flag once dwarf put month scene mouse summer dirt expect comic fiction dinner verb vehicle melody burger cargo little coral kite spoon brown reward'
            await WalletPlugin.sendMessage({
                payload: {
                    actorId,
                    id: '121112',
                    cmd: 'StoreMnemonic',
                    payload: {
                        mnemonic,
                        signerType: {
                            type: 'Stronghold'
                        }
                    }
                }
            })
        }
    })

    onDestroy(() => {
        if (Capacitor) {
            Capacitor.Plugins.WalletPlugin.destroy({ actorId })
            walletListener.remove()
        }
    })


    export let locale

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next')
    }

    const handleLanguage = (item) => {
        setLanguage(item)
        locale = $_
    }
</script>

<OnboardingLayout allowBack={false}>
    <div slot="leftpane__content">
        <div class="flex flex-col {$mobile && 'items-center text-center px-10'} space-y-4 mb-8">
            <Logo width="64px" logo="logo-firefly" classes="mb-6" />
            <Text type={$mobile ? 'h3' : 'h1'}>{locale('views.onboarding1.title')}</Text>
            <Text type="p" secondary>{locale('views.onboarding1.body')}</Text>
        </div>
        <Dropdown
            sortItems={true}
            onSelect={handleLanguage}
            value={locales[$appSettings.language]}
            items={Object.values(locales).map((locale) => ({ value: locale, label: locale }))} />
    </div>
    <div slot="leftpane__action">
        <Button onClick={() => handleContinueClick()} classes="w-full">{locale('actions.continue')}</Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-blue dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="welcome-desktop" />
    </div>
</OnboardingLayout>
