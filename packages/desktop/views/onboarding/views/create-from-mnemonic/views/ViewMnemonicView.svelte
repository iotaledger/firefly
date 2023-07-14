<script lang="ts">
    import { onMount } from 'svelte'

    import { Button, Icon, RecoveryPhrase, Text, TextType } from '@ui'
    import { OnboardingLayout } from '@components'

    import { localize } from '@core/i18n'
    import { downloadRecoveryKit } from '@core/utils'

    import {
        generateMnemonicForOnboardingProfile,
        onboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'

    import { Icon as IconEnum } from '@auxiliary/icon'
    import { createFromMnemonicRouter } from '../create-from-mnemonic-router'

    let isHidden: boolean = true
    let hasRevealedRecoveryPhrase: boolean = false

    function onContinueClick(): void {
        $createFromMnemonicRouter.next()
    }

    function onBackClick(): void {
        updateOnboardingProfile({ mnemonic: undefined, hasVerifiedMnemonic: false, hasStoredMnemonic: false })
        $createFromMnemonicRouter.previous()
    }

    function onMnemonicVisibilityClick(): void {
        isHidden = !isHidden
        hasRevealedRecoveryPhrase = true
    }

    function onDownloadClick(): void {
        downloadRecoveryKit()
    }

    onMount(() => {
        if (!$onboardingProfile?.mnemonic) {
            generateMnemonicForOnboardingProfile()
        }
    })
</script>

<OnboardingLayout {onBackClick}>
    <title-container slot="title" class="block">
        <Text type={TextType.h2}>{localize('views.onboarding.profileBackup.viewMnemonic.title')}</Text>
    </title-container>
    <leftpane-content slot="leftpane__content" class="block">
        <Text secondary classes="mb-4">{localize('views.onboarding.profileBackup.viewMnemonic.body1')}</Text>
        <Text secondary highlighted classes="font-bold mb-4">
            {localize('views.onboarding.profileBackup.viewMnemonic.body2')}
        </Text>
        <Text secondary classes="mb-4">{localize('views.onboarding.profileBackup.viewMnemonic.body3')}</Text>
    </leftpane-content>
    <leftpane-action slot="leftpane__action" class="flex flex-col space-y-4">
        <Button outline classes="w-full" onClick={onDownloadClick}>
            {localize('actions.downloadRecoveryKit')}
        </Button>
        <Button
            disabled={!hasRevealedRecoveryPhrase}
            classes="w-full"
            onClick={hasRevealedRecoveryPhrase ? onContinueClick : onMnemonicVisibilityClick}
        >
            {localize('actions.continue')}
        </Button>
    </leftpane-action>
    <rightpane-container slot="rightpane" class="w-full h-full flex flex-col items-center justify-center p-4">
        {#if $onboardingProfile?.mnemonic}
            <RecoveryPhrase blurred={isHidden} />
            {#if !hasRevealedRecoveryPhrase}
                {#if isHidden}
                    <Button onClick={onMnemonicVisibilityClick} classes="absolute">
                        {localize('views.onboarding.profileBackup.viewMnemonic.revealRecoveryPhrase')}
                    </Button>
                {/if}
            {:else}
                <button
                    on:click={onMnemonicVisibilityClick}
                    class="absolute top-10 right-10 flex flex-row items-center highlight"
                    type="button"
                >
                    <Text smaller overrideColor classes="text-blue-500 mr-2">
                        {localize(
                            `views.onboarding.profileBackup.viewMnemonic.${
                                isHidden ? 'revealRecoveryPhrase' : 'hideRecoveryPhrase'
                            }`
                        )}
                    </Text>
                    <Icon icon={isHidden ? IconEnum.View : IconEnum.Hide} classes="text-blue-500" />
                </button>
            {/if}
        {/if}
    </rightpane-container>
</OnboardingLayout>

<style lang="scss">
    .highlight {
        transition: filter 0.2s;

        &:focus {
            filter: brightness(1.3);
        }
    }
</style>
