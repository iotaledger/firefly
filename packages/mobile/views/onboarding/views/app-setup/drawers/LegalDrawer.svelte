<script lang="ts">
    import { localize } from '@core/i18n'
    import { ConditionOfUse, Drawer } from '../../../../../components'

    export let onClose: () => unknown = () => {}
</script>

<Drawer
    {onClose}
    title={`${localize('popups.legalUpdate.tosTitle')} & ${localize('popups.legalUpdate.privPolicyTitle')}`}
    allowBack={true}
    onBackClick={onClose}
    fullScreen
>
    <div class="overflow-auto mt-4">
        <ConditionOfUse />
    </div>
</Drawer>
