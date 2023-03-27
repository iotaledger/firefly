<script lang="ts">
    import { localize } from '@core/i18n'
    import { Text, TextType } from '@ui'

    export let setting: string
</script>

<settings-section class="space-y-5">
    <div class="space-y-3">
        <Text type={TextType.h4}>{localize(`views.settings.${setting}.title`)}</Text>
        <Text type={TextType.p} secondary>{localize(`views.settings.${setting}.description`)}</Text>
    </div>
    <slot />
</settings-section>
