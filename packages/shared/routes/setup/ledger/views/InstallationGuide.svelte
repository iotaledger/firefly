<script lang="typescript">
    import { Animation, Button, Icon, OnboardingLayout, Text } from 'shared/components';
    import { openPopup } from 'shared/lib/popup';
    import { createEventDispatcher } from 'svelte';

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next')
    }

    function handleBackClick() {
        dispatch('previous')
    }

    function handlePopupOpen() {
        openPopup({
            type: 'ledgerAppGuide'
        })
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} {locale} showLedgerVideoButton>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">Have you installed the necessary Ledger apps?</Text>
            <Text type="p" classes="mb-2" secondary>
                Before you proceed, you must use Ledger Live to find and install
                both the IOTA Legacy app and the new IOTA (MIOTA) app. Any
                pre-installed apps should be updated to their latest versions.
            </Text>
        </div>
        <div slot="leftpane__action">
            <div on:click={handlePopupOpen} class="mb-6 flex flex-row justify-center cursor-pointer">
                <Icon icon="info" classes="mr-2 text-blue-500" />
                <Text secondary highlighted>
                    Guide to installing the Ledger apps
                </Text>
            </div>
            <Button classes="w-full" onClick="{handleContinueClick}">
                Yes, I've installed these apps
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-pastel-blue dark:bg-gray-900">
            <Animation animation="profile-desktop" />
        </div>
    </OnboardingLayout>
{/if}
