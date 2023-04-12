<script lang="ts">
    import { ProfileButton } from '@components'
    import { Button, Logo } from '@ui'

    import { initialiseOnboardingRouters, loginRouter } from '@/routers'
    import { appSettings, needsToAcceptLatestPrivacyPolicy, needsToAcceptLatestTermsOfService } from '@core/app'
    import { localize } from '@core/i18n'
    import { NetworkProtocol, NetworkType } from '@core/network'
    import { loadPersistedProfileIntoActiveProfile, profiles } from '@core/profile'

    import {
        initialiseOnboardingProfile,
        shouldBeDeveloperProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'

    import { DrawerId, openDrawer } from '@/auxiliary/drawer'

    $: if (needsToAcceptLatestPrivacyPolicy() || needsToAcceptLatestTermsOfService()) {
        openDrawer(DrawerId.LegalUpdate, { preventClose: true })
    }

    $: dark = $appSettings.darkMode

    function onContinueClick(id: string): void {
        loadPersistedProfileIntoActiveProfile(id)
        $loginRouter.next()
    }

    async function onAddProfileClick(): Promise<void> {
        await initialiseOnboardingProfile(shouldBeDeveloperProfile(), NetworkProtocol.Shimmer)
        if (!shouldBeDeveloperProfile()) {
            updateOnboardingProfile({ networkType: NetworkType.Mainnet })
        }
        initialiseOnboardingRouters()
        $loginRouter.next({ shouldAddProfile: true })
    }
</script>

<div class="h-full px-5 pb-5 flex flex-col">
    <section class="overlay-scrollbar flex flex-col items-center w-full h-full pt-16">
        <Logo width="64px" logo="logo-firefly" />
        <div class="w-full flex flex-col mt-10">
            {#each $profiles as profile}
                <div class="w-full item-center mb-4">
                    <ProfileButton
                        onClick={onContinueClick}
                        name={profile.name}
                        id={profile.id}
                        networkId={profile?.network.id}
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
