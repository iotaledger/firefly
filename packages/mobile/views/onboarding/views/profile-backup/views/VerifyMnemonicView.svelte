<script lang="ts">
    import { onMount } from 'svelte'

    import { OnboardingLayout } from '@components'
    import { Icon, Text, TextType, RecoveryPhrase } from '@ui'

    import { localize } from '@core/i18n'

    import { getWordChoices, Mnemonic, onboardingProfile, verifyAndStoreMnemonic } from '@contexts/onboarding'

    import { Icon as IconEnum } from '@auxiliary/icon'

    import { profileBackupRouter } from '@/routers'

    const verifyRecoveryPhrase: Mnemonic = []

    let wordChoices: string[] = ['', '', '']
    let verifyIndex: number = 0
    let isVerified: boolean = false

    $: if (isVerified) {
        completeVerification()
    }

    function onChoiceClick(word: string): void {
        const wordElement = document.getElementById(`recovery-word-${verifyIndex}`)
        wordElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        verifyRecoveryPhrase[verifyIndex] = word
        if ($onboardingProfile?.mnemonic[verifyIndex] === word) {
            if (verifyIndex === $onboardingProfile?.mnemonic.length - 1) {
                isVerified = true
            } else {
                verifyIndex++
                wordChoices = getWordChoices(verifyRecoveryPhrase.length)
            }
        }
    }

    async function completeVerification(): Promise<void> {
        await verifyAndStoreMnemonic()
        $profileBackupRouter.next()
    }

    function onBackClick(): void {
        $profileBackupRouter.previous()
    }

    onMount(() => {
        wordChoices = getWordChoices(verifyRecoveryPhrase.length)
    })
</script>

<OnboardingLayout {onBackClick} title={localize('views.onboarding.profileBackup.verifyMnemonic.title')}>
    <content-container slot="content" class="w-full h-full flex flex-col p-0">
        {#if !isVerified}
            <Text secondary fontSize="15" classes="mb-4">
                {localize('views.onboarding.profileBackup.verifyMnemonic.body')}
            </Text>
        {:else}
            <div class="flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-5">
                <div class="bg-green-500 rounded-2xl relative -top-10">
                    <Icon icon={IconEnum.SuccessCheck} classes="text-white" />
                </div>
                <Text type={TextType.h2} classes="mb-5 text-center">
                    {localize('views.onboarding.profileBackup.verifyMnemonic.verified')}
                </Text>
                <Text secondary fontSize="15" classes="mb-2">
                    {localize('views.onboarding.profileBackup.verifyMnemonic.verifiedBody')}
                </Text>
            </div>
        {/if}
        <RecoveryPhrase {verifyRecoveryPhrase} boxed />
    </content-container>
    <footer-container slot="footer" class="block">
        {#if !isVerified}
            {#each wordChoices as word}
                <button
                    type="button"
                    class="w-full flex flex-row p-4 mb-4 rounded-2xl border border-1 border-solid items-center
                    justify-between border-gray-300 dark:border-gray-700 hover:border-gray-500
                    dark:hover:border-gray-700 focus:border-gray-500 dark:focus:border-gray-700"
                    on:click={() => onChoiceClick(word)}
                >
                    <Text smaller fontSize="15" classes="ml-3" bold>{word}</Text>
                    <Icon icon={IconEnum.ChevronRight} classes="text-gray-800 dark:text-white" />
                </button>
            {/each}
        {/if}
    </footer-container>
</OnboardingLayout>
