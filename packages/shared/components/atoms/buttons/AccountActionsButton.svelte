<script lang="ts">
    import { Modal, AccountActionsMenu, MeatballMenuButton } from 'shared/components'

    let modal: Modal
</script>

<div class="relative">
    <MeatballMenuButton onClick={modal?.toggle} />
    <AccountActionsMenu bind:modal position={{ right: '0' }} classes="mt-1.5" />
</div>
