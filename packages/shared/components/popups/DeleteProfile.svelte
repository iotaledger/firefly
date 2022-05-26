<script lang="typescript">
    import { get } from 'svelte/store'
    import { Button, Password, Text } from 'shared/components'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import {
        activeProfile,
        isSoftwareProfile,
        logout,
        profiles,
        removeProfile,
        removeProfileFolder,
    } from '@core/profile'
    import { appRouter } from '@core/router'
    import { Locale } from '@core/i18n'
    import { deleteStorage, setStrongholdPassword } from '@core/profile-manager'

    export let locale: Locale

    let isBusy = false
    let error = ''
    let password: string

    async function handleDeleteClick() {
        isBusy = true
        error = ''
        if ($isSoftwareProfile) {
            await deleteStrongholdAccount(password)
        } else {
            await triggerDeleteProfile()
        }
    }

    async function deleteStrongholdAccount(password: string): Promise<void> {
        try {
            await setStrongholdPassword(password)
            await triggerDeleteProfile()
        } catch (e) {
            error = locale(e.error)
            isBusy = false
        }
    }

    // TODO: move logic to action inn profile module
    async function triggerDeleteProfile() {
        try {
            const _activeProfile = get(activeProfile)
            if (!_activeProfile) return

            /**
             * CAUTION: We need to stop the background sync before we delete the profile.
             */
            // await asyncStopBackgroundSync()

            /**
             * CAUTION: The storage for wallet.rs must also be deleted in order
             * to free the locks on the files within the profile folder (removed
             * later).
             */
            await deleteStorage()

            /**
             * CAUTION: Logout must occur before the profile is removed
             * from the Svelte store list of profiles, otherwise the
             * actor is not able to be destroyed.
             */
            await logout(true, false)

            /**
             * CAUTION: The profile must be removed from the
             * app's list of profiles that lives as a Svelte store.
             */
            removeProfile(_activeProfile?.id)

            /**
             * NOTE: If there are no more profiles then the user should be
             * routed to the welcome screen.
             */
            if (get(profiles).length === 0) {
                $appRouter.reset()
            }

            /**
             * CAUTION: This removes the actual directory for the profile,
             * so it should occur last.
             */
            await removeProfileFolder(_activeProfile?.id)
        } catch (err) {
            if (err && err?.type && err?.type === 'AccountNotEmpty') {
                showAppNotification({
                    type: 'error',
                    message: locale('error.profile.delete.nonEmptyAccounts'),
                })
            } else {
                showAppNotification({
                    type: 'error',
                    message: locale('error.global.generic'),
                })
            }
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
            disabled={isBusy}
        />
    {/if}
</div>
<div class="flex flex-row justify-between space-x-4 w-full md:px-8">
    <Button secondary classes="w-1/2" onClick={() => closePopup()} disabled={isBusy}>{locale('actions.no')}</Button>
    <Button
        disabled={(!password && $isSoftwareProfile) || isBusy}
        classes="w-1/2"
        onClick={() => handleDeleteClick()}
        warning
    >
        {locale('actions.yes')}
    </Button>
</div>
