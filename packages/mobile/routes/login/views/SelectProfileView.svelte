<script lang="typescript">
    import { Icon, Logo, Profile } from 'shared/components'
    import { mobile, needsToAcceptLatestPrivacyPolicy, needsToAcceptLatestTermsOfService } from '@core/app'
    import { localize } from '@core/i18n'
    import { NetworkProtocol, NetworkType } from '@core/network'
    import { ProfileType, profiles, loadPersistedProfileIntoActiveProfile } from '@core/profile'
    import { initialiseOnboardingRouters, loginRouter } from '@core/router'
    import { initialiseOnboardingProfile, shouldBeDeveloperProfile } from '@contexts/onboarding'
    import { openPopup } from '@lib/popup'

    function onContinueClick(id: string) {
        loadPersistedProfileIntoActiveProfile(id)
        $loginRouter.next()
    }

    function onAddProfileClick() {
        $loginRouter.next({ shouldAddProfile: true })
        initialiseOnboardingRouters()
        initialiseOnboardingProfile(shouldBeDeveloperProfile())
    }

    $: if (needsToAcceptLatestPrivacyPolicy() || needsToAcceptLatestTermsOfService()) {
        openPopup({
            type: 'legalUpdate',
            hideClose: true,
            preventClose: true,
        })
    }
</script>

<section class="flex flex-col justify-center items-center h-full bg-white dark:bg-gray-900 px-40 pt-48 pb-20">
    <Logo width="64px" logo="logo-firefly" classes="absolute top-20" />
    <div
        class="profiles-wrapper h-auto items-start justify-center w-full {!$mobile &&
            'overlay-scrollbar'} flex flex-row flex-wrap"
    >
        {#each $profiles as profile}
            <div class="mx-7 mb-8">
                <Profile
                    bgColor="blue"
                    onClick={onContinueClick}
                    name={profile.name}
                    id={profile.id}
                    isDeveloper={profile.isDeveloperProfile}
                    networkType={profile?.networkType ?? NetworkType.Devnet}
                    networkProtocol={profile?.networkProtocol ?? NetworkProtocol.IOTA}
                    isLedgerProfile={profile?.type === ProfileType.Ledger}
                    classes="cursor-pointer"
                />
            </div>
        {/each}
        <div class="mx-7 mb-8">
            <Profile
                onClick={onAddProfileClick}
                name={localize('general.addProfile')}
                classes="border-solid border-2 border-gray-400 cursor-pointer"
            >
                <Icon height="15" width="15" icon="plus" classes="text-blue-500" />
            </Profile>
        </div>
    </div>
</section>
