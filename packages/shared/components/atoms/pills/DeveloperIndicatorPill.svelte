<script lang="ts">
    import { localize } from '@core/i18n'
    import { Pill } from 'shared/components'
</script>

<Pill
    data={localize('general.dev')}
    textColor="gray-600"
    darkTextColor="white"
    backgroundColor="gray-100"
    darkBackgroundColor="gray-700"
    classes="uppercase dark:bg-opacity-20 rounded-full px-3"
/>
