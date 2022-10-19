<script lang="typescript">
    import { ProfileButton } from '../../../components'
    import { Button, Logo, Text, TextType } from 'shared/components'
    import { needsToAcceptLatestPrivacyPolicy, needsToAcceptLatestTermsOfService, appSettings } from '@core/app'
    import { localize } from '@core/i18n'
    import { NetworkProtocol, NetworkType } from '@core/network'
    import { profiles, loadPersistedProfileIntoActiveProfile } from '@core/profile'
    import { initialiseOnboardingRouters, loginRouter } from '../../../lib/core/router'
    import {
        initialiseOnboardingProfile,
        shouldBeDeveloperProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { openPopup } from '@auxiliary/popup'

    $: dark = $appSettings.darkMode

    function onContinueClick(id: string) {
        loadPersistedProfileIntoActiveProfile(id)
        $loginRouter.next()
    }

    function onAddProfileClick() {
        initialiseOnboardingProfile(shouldBeDeveloperProfile(), NetworkProtocol.Shimmer)
        if (!shouldBeDeveloperProfile()) {
            updateOnboardingProfile({ networkType: NetworkType.Mainnet })
        }
        initialiseOnboardingRouters()
        $loginRouter.next({ shouldAddProfile: true })
    }

    $: if (needsToAcceptLatestPrivacyPolicy() || needsToAcceptLatestTermsOfService()) {
        openPopup({
            type: 'legalUpdate',
            hideClose: true,
            preventClose: true,
        })
    }
</script>

<div class="h-full px-5 pb-5 flex flex-col">
    <section class="overlay-scrollbar flex flex-col items-center w-full h-full pt-16">
        <Logo width="64px" logo="logo-firefly" />
        <!-- @TODO: Add text to locals -->
        <Text type={TextType.h3} bold classes="text-center mt-4">Welcome back!</Text>
        <div class="w-full flex flex-col mt-10">
            {#each $profiles as profile}
                <div class="w-full item-center mb-4">
                    <ProfileButton
                        onClick={onContinueClick}
                        name={profile.name}
                        id={profile.id}
                        networkType={profile?.networkType ?? NetworkType.Devnet}
                        networkProtocol={profile?.networkProtocol ?? NetworkProtocol.IOTA}
                    />
                </div>
            {/each}
        </div>
    </section>
    <footer class="w-full pt-5">
        <Button
            classes="w-full text-blue-500 border border-solid
                {dark ? 'border-gray-700' : 'border-gray-300'}"
            variant="none"
            onClick={onAddProfileClick}
        >
            {localize('general.addProfile')}
        </Button>
    </footer>
</div>
