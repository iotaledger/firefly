<script lang="typescript">
    import { Button, Text, Illustration } from 'shared/components'
    import { closePopup } from '@lib/popup'
    import { localize } from '@core/i18n'
    import { updateProfile } from '@lib/profile'

    function onClick() {
        closePopup()
        updateProfile('hasFinishedSingleAccountGuide', true)
    }
</script>

<div class="flex flex-col">
    <Illustration illustration="white-arrow" classes="absolute block w-12 h-12 top-14 left-0 right-0 mx-auto" />
    <Illustration illustration="single-account-guide-desktop" classes="w-full rounded-xl" />
    <Text type="h3" classes="pt-5">{localize('popups.singleAccountGuide.title')}</Text>
    <Text type="p" classes="pt-3 pb-5">{localize('popups.singleAccountGuide.body')}</Text>
    <Button {onClick}>{localize('actions.okIUnderstand')}</Button>
</div>
