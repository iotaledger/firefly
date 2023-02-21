<script lang="ts">
    import { ConditionOfUse, Drawer } from '../../../../../components'
    import { localize } from '@core/i18n'

    export let onClose: () => unknown = () => {}
</script>

<Drawer {onClose} title={localize('views.onboarding.appSetup.legal.title')} onBackClick={onClose} allowBack fullScreen>
    <legal-drawer class="block overflow-auto mt-4">
        <ConditionOfUse />
    </legal-drawer>
</Drawer>
