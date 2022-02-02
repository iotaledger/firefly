<script lang="typescript">
    import { onDestroy } from 'svelte'
    import { Button, Checkbox, Text } from 'shared/components'
    import { lastAcceptedPrivacyPolicy } from 'shared/lib/appSettings'
    import { localize } from 'shared/lib/i18n'
    import { closePopup } from 'shared/lib/popup'
    import { PRIVACY_POLICY_VERSION } from 'shared/lib/app'
    import { Electron } from 'shared/lib/electron';

    let checked = false
    const PRIVACY_POLICY_LINK = 'https://firefly.iota.org/privacy'

    const handleViewClick = () => {
        Electron.openUrl(PRIVACY_POLICY_LINK)
    }

    const handleConfirmClick = () => {
        lastAcceptedPrivacyPolicy.set(PRIVACY_POLICY_VERSION)

        closePopup(true)
    }

    onDestroy(() => closePopup)
</script>

<div class="mb-6">
    <Text type="h4" classes="mb-4">{localize('popups.privacyPolicyUpdate.title')}</Text>
    <Text type="p" secondary>{localize('popups.privacyPolicyUpdate.body')}</Text>
    <Checkbox label={localize('popups.privacyPolicyUpdate.checkbox')} bind:checked classes="mt-4" />
</div>
<div class="flex flex-row flex-nowrap w-full space-x-4">
    <Button secondary classes="w-1/2" onClick={handleViewClick}>{localize('popups.privacyPolicyUpdate.viewButton')}</Button>
    <Button autofocus classes="w-1/2" onClick={handleConfirmClick} disabled={!checked}>{localize('actions.confirm')}</Button>
</div>
