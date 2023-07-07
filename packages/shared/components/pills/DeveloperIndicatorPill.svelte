<script lang="ts">
    import { localize } from '@core/i18n'
    import { PillBorderRadius } from 'components/enums'
    import { Pill } from 'shared/components'
</script>

<Pill
    data={localize('general.dev')}
    textColor="gray-600"
    darkTextColor="white"
    backgroundColor="bg-gray-100 dark:bg-opacity-20"
    uppercase
    rounded={PillBorderRadius.Full}
/>
