<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { OnboardingLayout } from '@components'
    import { Mnemonic, getWordChoices, onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { Button, Icon, RecoveryPhrase, Text, TextType } from '@ui'
    import { onMount } from 'svelte'
    import { createFromMnemonicRouter } from '../create-from-mnemonic-router'

    const verifyRecoveryPhrase: Mnemonic = []
    const wordElements: HTMLButtonElement[] = []

    let wordChoices: string[] = ['', '', '']
    let verifyIndex: number = 0
    let isVerified: boolean = $onboardingProfile?.hasVerifiedMnemonic

    function onChoiceClick(word: string): void {
        verifyRecoveryPhrase[verifyIndex] = word
        if ($onboardingProfile?.mnemonic[verifyIndex] === word) {
            if (verifyIndex === $onboardingProfile?.mnemonic.length - 1) {
                isVerified = true
                updateOnboardingProfile({ hasVerifiedMnemonic: true })
            } else {
                verifyIndex++
                wordChoices = getWordChoices(verifyRecoveryPhrase.length)
            }
        }
    }

    function onContinueClick(): void {
        $createFromMnemonicRouter.next()
    }

    function onBackClick(): void {
        $createFromMnemonicRouter.previous()
    }

    function onKeyPress(event: KeyboardEvent): void {
        if (!isVerified) {
            switch (event.key) {
                case '1':
                    wordElements[0].click()
                    break
                case '2':
                    wordElements[1].click()
                    break
                case '3':
                    wordElements[2].click()
                    break
                default:
                    break
            }
        }
    }

    onMount(() => {
        wordChoices = getWordChoices(verifyRecoveryPhrase.length)
    })
</script>

<svelte:window on:keypress={onKeyPress} />

<OnboardingLayout {onBackClick}>
    <title-container slot="title" class="block">
        <Text type={TextType.h2} classes={isVerified && 'hidden'}>
            {localize('views.onboarding.profileBackup.verifyMnemonic.title')}
        </Text>
    </title-container>
    <leftpane-content slot="leftpane__content" class="block">
        {#if !isVerified}
            <Text secondary classes="'mb-10">
                {localize('views.onboarding.profileBackup.verifyMnemonic.body')}
            </Text>
            <Text classes="mb-4">
                {localize('views.onboarding.profileBackup.verifyMnemonic.word')} #{verifyIndex + 1}
            </Text>
            {#each wordChoices as word, i}
                <button
                    type="button"
                    class="w-full flex flex-row p-4 mb-4 rounded-2xl border border-solid items-center justify-between
                    border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700
                    focus:border-gray-500 dark:focus:border-gray-700"
                    on:click={() => onChoiceClick(word)}
                    bind:this={wordElements[i]}
                >
                    <Text smaller classes="ml-3">{`${i + 1}. ${word}`}</Text>
                    <Icon icon={IconEnum.ChevronRight} classes="text-gray-800 dark:text-white" />
                </button>
            {/each}
        {:else}
            <div class="flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-5">
                <icon-container class="block bg-green-500 rounded-2xl relative -top-10">
                    <Icon icon={IconEnum.SuccessCheck} classes="text-white" />
                </icon-container>
                <Text type={TextType.h2} classes="mb-5 text-center">
                    {localize('views.onboarding.profileBackup.verifyMnemonic.verified')}
                </Text>
                <Text secondary classes="mb-2">
                    {localize('views.onboarding.profileBackup.verifyMnemonic.verifiedBody')}
                </Text>
            </div>
        {/if}
    </leftpane-content>
    <leftpane-action slot="leftpane__action" class="block">
        {#if isVerified}
            <Button classes="w-full" onClick={onContinueClick}>
                {localize('actions.continue')}
            </Button>
        {/if}
    </leftpane-action>
    <rightpane-container slot="rightpane" class="w-full h-full flex flex-col items-center justify-center p-4">
        <RecoveryPhrase recoveryPhrase={$onboardingProfile?.mnemonic} {verifyRecoveryPhrase} />
    </rightpane-container>
</OnboardingLayout>
