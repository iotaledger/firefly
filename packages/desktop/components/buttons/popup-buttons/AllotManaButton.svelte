<script lang="ts">
    import { OnboardingButton } from '@ui'
    import { localize } from '@core/i18n'
    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'

    function allotMana(): void {
        closePopup()
    }

    function onAllotManaClick(): void {
        openPopup({
            id: PopupId.AllotMana,
            props: {
                title: localize('actions.allotMana'),
                confirmText: localize('actions.send'),
                onConfirm: allotMana,
            },
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.allotMana')}
    secondaryText={localize('general.allotManaDescription')}
    onClick={onAllotManaClick}
/>
