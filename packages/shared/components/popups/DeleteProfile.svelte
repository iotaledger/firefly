<script lang="typescript">
    import { Button, Password, Text } from 'shared/components'
    import { logout } from 'shared/lib/app'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import { activeProfile, isSoftwareProfile, profiles, removeProfile, removeProfileFolder } from 'shared/lib/profile'
    import { setRoute } from 'shared/lib/router'
    import { AppRoute } from 'shared/lib/typings/routes'
    import { api, asyncRemoveWalletAccounts, wallet } from 'shared/lib/wallet'
    import { get } from 'svelte/store'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    let isBusy = false
    let error = ''
    let password

    async function handleDeleteClick() {
        isBusy = true
        error = ''
        if ($isSoftwareProfile) {
            api.setStrongholdPassword(password, {
                async onSuccess() {
                    await triggerDeleteProfile()
                },
                onError(err) {
                    isBusy = false
                    error = locale(err.error)
                },
            })
        } else {
            await triggerDeleteProfile()
        }
    }

    async function triggerDeleteProfile() {
        try {
            const _activeProfile = get(activeProfile)

            // The account data associated with a profile must also be deleted
            // and since logout() destroys the event actor, we must call the API
            // now to remove the data
            await asyncRemoveWalletAccounts(get(get(wallet).accounts))

            // We have to logout before the profile is removed
            // from the profile list otherwise the activeProfile which is
            // derived from profiles is undefined and the actor
            // is not destroyed
            await logout()

            // Now that all the resources have been freed we try
            // and remove the profile folder, this will retry until locks
            // can be gained
            if (_activeProfile) {
                // Remove the profile from the active list of profiles
                removeProfile(_activeProfile.id)

                // If after removing the profile there are none left
                // we need to make sure the router gets reset to the welcome screen
                // by default it will go to the profile selection
                if (get(profiles).length === 0) {
                    setRoute(AppRoute.Welcome)
                }

                // Remove the profile folder this will wait until it can get
                // the lock on the resources
                await removeProfileFolder(_activeProfile.name)
            }
        } catch (err) {
            showAppNotification({
                type: 'error',
                message: locale('error.global.generic'),
            })
        } finally {
            isBusy = false
        }
    }
</script>

<Text type="h4" classes="mb-5">{locale('popups.deleteProfile.title')}</Text>
<div class="w-full h-full mb-5">
    <Text classes="mb-3">{locale('popups.deleteProfile.confirmation')}</Text>
    {#if $isSoftwareProfile}
        <Text type="p" secondary classes="mb-3">{locale('popups.deleteProfile.typePassword')}</Text>
        <Password
            {error}
            classes="w-full mb-8"
            bind:value={password}
            showRevealToggle
            {locale}
            placeholder={locale('general.password')}
            autofocus
            submitHandler={() => handleDeleteClick()}
            disabled={isBusy} />
    {/if}
</div>
<div class="flex flex-row justify-between space-x-4 w-full px-8 ">
    <Button secondary classes="w-1/2" onClick={() => closePopup()} disabled={isBusy}>{locale('actions.no')}</Button>
    <Button disabled={(!password && $isSoftwareProfile) || isBusy} classes="w-1/2" onClick={() => handleDeleteClick()} warning>
        {locale('actions.yes')}
    </Button>
</div>
