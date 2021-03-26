<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { logout } from 'shared/lib/app'
    import { Electron } from 'shared/lib/electron'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import { activeProfile, removeProfile, removeProfileFolder } from 'shared/lib/profile'
    import { api } from 'shared/lib/wallet'
    import { get } from 'svelte/store'

    export let locale

    let isBusy = false

    function deleteProfile() {
        isBusy = true
        const ap = get(activeProfile)
        if (!ap) {
            logout()
            return
        }

        Electron.PincodeManager.remove(ap.id).then((isRemoved) => {
            if (!isRemoved) {
                console.error('Something went wrong removing pincode entry.')
            }

            // Remove storage
            api.removeStorage({
                onSuccess(res) {
                    logout()

                    removeProfile(ap.id)
                    removeProfileFolder(ap.name)

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
