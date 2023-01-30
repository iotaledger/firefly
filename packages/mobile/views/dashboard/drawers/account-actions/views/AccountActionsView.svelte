<script lang="typescript">
    import { localize } from '@core/i18n'
    import features from '@features/features'
    import { Icon } from '@lib/auxiliary/icon/enums'
    import { Button } from '@ui'

    export let onClose: () => unknown
</script>

<div class="flex flex-col space-y-4">
    {#if features?.dashboard?.accountActions?.customize?.enabled}
        <Button outline icon={Icon.Customize}>
            {localize('actions.customizeAcount')}
        </Button>
    {/if}
</div>
