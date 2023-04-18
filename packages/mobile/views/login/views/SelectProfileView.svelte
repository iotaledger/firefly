<script lang="ts">
    import { ProfileButton } from '@components'
    import { Button, Logo } from '@ui'

    import { appSettings, needsToAcceptLatestPrivacyPolicy, needsToAcceptLatestTermsOfService } from '@core/app'
    import { localize } from '@core/i18n'
    import { loadPersistedProfileIntoActiveProfile, profiles } from '@core/profile'

    import { initialiseOnboardingFlow, shouldBeDeveloperProfile } from '@contexts/onboarding'

    import { DrawerId, openDrawer } from '@/auxiliary/drawer'
    import { initialiseOnboardingRouters, loginRouter } from '@/routers'

    $: if (needsToAcceptLatestPrivacyPolicy() || needsToAcceptLatestTermsOfService()) {
        openDrawer({ id: DrawerId.LegalUpdate, props: { preventClose: true } })
    }

    $: dark = $appSettings.darkMode

    function onContinueClick(profileId: string): void {
        loadPersistedProfileIntoActiveProfile(profileId)
        $loginRouter.next()
    }

    async function onAddProfileClick(): Promise<void> {
        const isDeveloperProfile = shouldBeDeveloperProfile()
        await initialiseOnboardingFlow({
            isDeveloperProfile,
            ...(!isDeveloperProfile && { networkId: NetworkId.Shimmer }),
        })
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
                    <ProfileButton {profile} onClick={onContinueClick} />
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
