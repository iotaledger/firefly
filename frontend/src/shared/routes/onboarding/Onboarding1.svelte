<script>
    import { Logo, Box, Illustration, Text, Button, Link } from '@shared-components'
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
            <Text type="p" secondary={true} classes="mb-6 mx-12">{locale('views.onboarding_1.body')}</Text>
            <Button classes="mb-5" onClick={() => goto('legal')}>{locale('actions.continue')}</Button>
            <Link onClick={() => console.log('horo')}>{locale('actions.import_seed')}</Link>
        </Box>
    </Box>
{:else}
    <Box classes="w-full h-full flex flex-row">
        <Box width="430px" classes="flex flex-col flex-shrink-0 justify-between pt-12 pb-16 px-12 w-2/6">
            <Box classes="flex flex-col">
                <Logo width="64px" logo="logo-firefly" classes="mb-10 mt-12" />
                <Text type="h1" classes="mb-5">{locale('views.onboarding_1.title')}</Text>
                <Text type="p" secondary={true}>{locale('views.onboarding_1.body')}</Text>
            </Box>
            <Box classes="flex flex-row justify-between items-center">
                <Link onClick={() => console.log('horo')}>{locale('actions.import_seed')}</Link>
                <Button onClick={() => goto('legal')}>{locale('actions.continue')}</Button>
            </Box>
        </Box>
        <Box classes="w-full h-full flex p-16 bg-white">
            <Illustration width="100%" illustration="onboarding-1-desktop" />
        </Box>
    </Box>
{/if}
