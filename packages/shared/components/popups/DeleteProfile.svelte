<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import { activeProfile, removeProfile } from 'shared/lib/profile'
    import { resetRouter } from 'shared/lib/router'
    import { api, destroyActor, resetWallet } from 'shared/lib/wallet'
    import { get } from 'svelte/store'

    export let locale

    let isBusy = false

    function deleteProfile() {
        isBusy = true
        Electron.PincodeManager.remove(get(activeProfile).id).then((isRemoved) => {
            if (!isRemoved) {
                throw new Error('Something went wrong removing pincode entry.')
            }

            // Remove storage
            api.removeStorage({
                onSuccess(res) {
                    // Destroy wallet.rs actor for this profile
                    destroyActor($activeProfile.id)

                    resetWallet()
                    resetRouter()

                    // Remove profile from (local) storage
                    // Note: This should be the last step in the reset process.
                    // It should be done after the router is set back to default.
                    // Otherwise, parts of the application referencing $activeProfile will create an exception.
                    removeProfile($activeProfile.id)

                    isBusy = false
                    closePopup()
                },
                onError(err) {
                    isBusy = false
                    closePopup()
                    showAppNotification({
                        type: 'error',
                        message: locale(err.error),
                    })
                },
            })
        })
    }
</script>

<Text type="h4" classes="mb-5">{locale('popups.deleteProfile.title')}</Text>
<div class="w-full h-full mb-5">
    <Text>{locale('popups.deleteProfile.confirmation')}</Text>
</div>
<div class="flex flex-row justify-between space-x-4 w-full px-8 ">
    <Button secondary classes="w-1/2" onClick={() => closePopup()} disabled={isBusy}>{locale('actions.no')}</Button>
    <Button disabled={isBusy} classes="w-1/2" onClick={() => deleteProfile()} warning>{locale('actions.yes')}</Button>
</div>
