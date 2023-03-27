<script lang="ts">
    import { localize } from '@core/i18n'
    import { Text, TextType } from '@ui'

    export let setting: string

    $: title =
        localize(`views.settings.${setting}.title`) === `views.settings.${setting}.title`
            ? null
            : localize(`views.settings.${setting}.title`)
    $: description =
        localize(`views.settings.${setting}.description`) === `views.settings.${setting}.description`
            ? null
            : localize(`views.settings.${setting}.description`)
</script>

<settings-section class="space-y-5">
    <div class="space-y-3">
        {#if title}
            <Text type={TextType.h4}>{title}</Text>
        {/if}
        {#if description}
            <Text type={TextType.p} secondary>{description}</Text>
        {/if}
    </div>
    <slot />
</settings-section>
