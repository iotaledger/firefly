<script>
    import { OnboardingLayout, Logo, Box, Illustration, Text, Button, Link } from '@shared-components'
    export let locale
    export let mobile
    export let goto
</script>

{#if mobile}
    <Box classes="w-full h-full flex flex-col justify-between">
        <Box classes="w-full flex flex-col items-center">
            <Logo width="130px" logo="logo-firefly-complete-horizontal" classes="pt-12" />
            <Illustration width="100%" illustration="onboarding-1-mobile" />
        </Box>
        <Box classes="w-full flex flex-col items-center px-16 pb-8 text-center">
            <Text type="h1" classes="mb-2">{locale('views.onboarding_1.title')}</Text>
            <Text type="p" secondary classes="mb-6 mx-12">{locale('views.onboarding_1.body')}</Text>
            <Button classes="mb-5" onClick={() => goto('legal')}>{locale('actions.continue')}</Button>
            <Link onClick={() => console.log('horo')}>{locale('actions.import_seed')}</Link>
        </Box>
    </Box>
{:else}
    <OnboardingLayout allowBack={false}>
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5">{locale('views.onboarding_1.title')}</Text>
            <Text type="p" secondary>{locale('views.onboarding_1.body')}</Text>
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-end items-center">
            <Button onClick={() => goto('legal')}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16">
            <Illustration width="100%" illustration="onboarding-1-desktop" />
        </div>
    </OnboardingLayout>
{/if}
