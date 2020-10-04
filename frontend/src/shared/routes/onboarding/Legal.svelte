<script>
    import { Logo, Box, Text, Button, Scroller, Checkbox } from '@shared-components'
    export let locale
    export let mobile
    export let goto

    let checkboxChecked = false
    let scrollerProgress = 0
    let legalRead = false

    $: if (scrollerProgress === 100 || checkboxChecked) {
        legalRead = true
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <Box classes="w-full h-full flex flex-row">
        <Box width="430px" classes="flex flex-col flex-shrink-0 justify-between pt-12 pb-16 px-12 w-2/6">
            <Box classes="flex flex-col">
                <Logo width="64px" logo="logo-firefly" classes="mb-10 mt-12" />
                <Text type="h1" classes="mb-5">{locale('views.legal.title')}</Text>
                <Text type="p" secondary={true} classes="mb-8">{locale('views.legal.body')}</Text>
                <Button icon="parchment" classes="w-full mb-5" secondary={true} active={true} onClick={() => console.log('foo')}>
                    {locale('views.legal.privacy_policy.title')}
                </Button>
                <Button icon="doc" classes="w-full mb-8" secondary={true} active={true} onClick={() => console.log('foo')}>
                    {locale('views.legal.terms_of_service.title')}
                </Button>
                <Checkbox label={locale('views.legal.checkbox')} bind:checked={checkboxChecked} />
            </Box>
            <Box classes="flex flex-row justify-end items-center">
                <Button disabled={!legalRead} onClick={() => goto('setup')}>{locale('actions.continue')}</Button>
            </Box>
        </Box>
        <Scroller classes="w-full bg-white" bind:progress={scrollerProgress}>
            <Box width="540px" classes="block max-w-full mx-auto py-12">
                <Box classes="mb-12" anchor="privacy-policy" type="section">
                    <Text type="h1" classes="mb-5">{locale('views.legal.privacy_policy.title')}</Text>
                    <Text type="p" secondary={true} classes="mb-5">{locale('views.legal.privacy_policy.body_1')}</Text>
                    <Text type="p" secondary={true} classes="mb-5">{locale('views.legal.privacy_policy.body_2')}</Text>
                    <Text type="p" secondary={true} classes="mb-5">{locale('views.legal.privacy_policy.body_3')}</Text>
                    <Text type="p" secondary={true} classes="mb-5">{locale('views.legal.privacy_policy.body_4')}</Text>
                    <Text type="p" secondary={true} classes="mb-5">{locale('views.legal.privacy_policy.body_5')}</Text>
                    <Text type="p" secondary={true} classes="mb-10">{locale('views.legal.privacy_policy.body_6')}</Text>
                </Box>
                <Box anchor="terms-of-service" type="section">
                    <Text type="h1" classes="mb-5">{locale('views.legal.terms_of_service.title')}</Text>
                    <Text type="p" secondary={true} classes="mb-5">{locale('views.legal.terms_of_service.body_1')}</Text>
                    <Text type="p" secondary={true} classes="mb-5">{locale('views.legal.terms_of_service.body_2')}</Text>
                    <Text type="p" secondary={true} classes="mb-5">{locale('views.legal.terms_of_service.body_3')}</Text>
                    <Text type="p" secondary={true} classes="mb-5">{locale('views.legal.terms_of_service.body_4')}</Text>
                    <Text type="p" secondary={true} classes="mb-5">{locale('views.legal.terms_of_service.body_5')}</Text>
                    <Text type="p" secondary={true} classes="mb-10">{locale('views.legal.terms_of_service.body_6')}</Text>
                </Box>
            </Box>
        </Scroller>
    </Box>
{/if}
