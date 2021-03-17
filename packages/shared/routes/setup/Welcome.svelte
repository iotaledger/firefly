<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Button, Logo, Dropdown } from 'shared/components'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack={false}>
        <div slot="leftpane__content">
            <Logo width="64px" logo="logo-firefly" classes="mb-10" />
            <Text type="h1" classes="mb-4">{locale('views.onboarding1.title')}</Text>
            <Text type="p" secondary classes="mb-10">{locale('views.onboarding1.body')}</Text>
            <!-- TODO: Enable -->
            <Dropdown
                value="English"
                label={locale('general.language')}
                items={[{ value: 1, label: 'English' }, { value: 2, label: 'Belula' }]}
                disabled
                classes="opacity-50" />
        </div>
        <div slot="leftpane__action">
            <Button onClick={() => handleContinueClick()} classes="w-full">{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center p-16" style="background-color: #EEFBFF">
            <Illustration illustration="welcome-1-desktop" width="auto" height="auto" />
        </div>
    </OnboardingLayout>
{/if}
