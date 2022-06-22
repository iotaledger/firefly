<script lang="typescript">
    import { Button, Text, Illustration, TextHint } from 'shared/components'
    import { closePopup } from '@lib/popup'
    import { localize } from '@core/i18n'
    import { updateProfile } from '@lib/profile'
    import { mobile } from 'shared/lib/app'
    import { onMount } from 'svelte'

    let video = null

    function onClick() {
        closePopup()
        updateProfile('hasFinishedSingleAccountGuide', true)
    }

    onMount(() => {
        if (!$mobile) {
            video.play()
        }
    })
</script>

<div class="flex flex-col">
    {#if !$mobile}
        <Illustration illustration="white-arrow" classes="absolute block w-12 h-12 top-14 left-0 right-0 mx-auto" />
        <video
            class="w-full rounded-xl mb-4 h-auto"
            width="100%"
            height="auto"
            controls={false}
            muted
            playsinline
            loop
            bind:this={video}
        >
            <source src="assets/videos/single-account-guide.mp4" type="video/mp4" />
        </video>
        <Text type="h3" classes="mb-2">{localize('popups.singleAccountGuide.title')}</Text>
        <Text type="p" classes="mb-4">{localize('popups.singleAccountGuide.body')}</Text>
    {/if}
    <TextHint
        classes="p-4 rounded-2xl bg-blue-50 dark:bg-gray-800 mb-4"
        icon="info"
        iconClasses="fill-current text-blue-500 dark:text-blue-500"
        hint={localize('popups.singleAccountGuide.hint')}
        hintClasses="text-gray-500 dark:text-gray-500"
    />
    <Button {onClick}>{localize('actions.okIUnderstand')}</Button>
</div>
