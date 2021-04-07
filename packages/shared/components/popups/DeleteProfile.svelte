<script lang="typescript">
    import { Button, Password, Text } from 'shared/components'
    import { logout } from 'shared/lib/app'
    import { Electron } from 'shared/lib/electron'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import { activeProfile, removeProfile, removeProfileFolder } from 'shared/lib/profile'
    import { api } from 'shared/lib/wallet'
    import { get } from 'svelte/store'

    export let locale

    let isBusy = false
    let error = ''
    let password

    function deleteProfile() {
        isBusy = true
        error = ''
        api.setStrongholdPassword(password, {
            async onSuccess() {
                try {
                    const ap = get(activeProfile)
                    if (!ap) {
                        logout()
                        return
                    }

                    const isRemoved = await Electron.PincodeManager.remove(ap.id)
                    if (!isRemoved) {
                        console.error('Something went wrong removing pincode entry.')
                    }

                    removeProfile(ap.id)
                    await removeProfileFolder(ap.name)
                } catch (err) {
                    showAppNotification({
                        type: 'error',
                        message: locale(err.error),
                    })
                } finally {
                    isBusy = false
                    closePopup()
                    logout()
                }
            },
            onError(err) {
                isBusy = false
                error = locale(err.error)
            },
        })
    }
</script>

<Text type="h4" classes="mb-5">{locale('popups.deleteProfile.title')}</Text>
<div class="w-full h-full mb-5">
    <Text classes="mb-3">{locale('popups.deleteProfile.confirmation')}</Text>
    <Text type="p" secondary classes="mb-3">{locale('popups.deleteProfile.typePassword')}</Text>
    <Password
        {error}
        classes="w-full mb-8"
        bind:value={password}
        showRevealToggle
        {locale}
        placeholder={locale('general.password')}
        autofocus
        submitHandler={() => deleteProfile()}
        disabled={isBusy} />
</div>
<div class="flex flex-row justify-between space-x-4 w-full px-8 ">
    <Button secondary classes="w-1/2" onClick={() => closePopup()} disabled={isBusy}>{locale('actions.no')}</Button>
    <Button disabled={!password || isBusy} classes="w-1/2" onClick={() => deleteProfile()} warning>
        {locale('actions.yes')}
    </Button>
</div>
