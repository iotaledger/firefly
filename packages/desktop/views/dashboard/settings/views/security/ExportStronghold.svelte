<script lang="ts">
    import { ExportStrongholdButton, Spinner, Text, TextType } from 'shared/components'
    import { localize } from '@core/i18n'

    let isBusy: boolean = false
    let message: string = ''
</script>

<Text type={TextType.h4} classes="mb-3">{localize('views.settings.exportStronghold.title')}</Text>
<Text type={TextType.p} secondary classes="mb-5">{localize('views.settings.exportStronghold.description')}</Text>
<div class="flex flex-row items-center space-x-2">
    <ExportStrongholdButton bind:isBusy bind:message />
    {#if isBusy}
        <Spinner {message} />
    {/if}
</div>
