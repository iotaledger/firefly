<script lang="ts">
    import { MenuItem, Modal } from '@ui'
    import { localize } from '@core/i18n'

    import { Icon } from '@auxiliary/icon/enums'
    import { openPopup, PopupId } from '@auxiliary/popup'

    export let modal: Modal = undefined

    function onVestingFinderClick(): void {
        openPopup({ id: PopupId.VestingRewardsFinder })
        modal?.close()
    }
</script>

<Modal bind:this={modal} {...$$restProps}>
    <vesting-modal class="flex flex-col">
        <MenuItem
            icon={Icon.Search}
            title={localize('actions.viewVestingRewardsFinder')}
            onClick={onVestingFinderClick}
        />
    </vesting-modal>
</Modal>
