<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { Locale } from '@core/i18n'

    export let locale: Locale
</script>

<div class="p-8 flex flex-col w-full items-center justify-center text-center">
    <Icon icon="ledger" width="48" height="48" classes="mb-6 text-gray-800 dark:text-white" />
    <Text type="p" classes="mb-6 px-16">{locale('popups.ledgerConfirmation.confirm')}</Text>
</div>
