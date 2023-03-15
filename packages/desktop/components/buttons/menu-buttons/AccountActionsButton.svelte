<script lang="ts">
    import { AccountActionsMenu } from '@components'
    import { Modal, MeatballMenuButton } from '@ui'

    let modal: Modal
</script>

<account-actions-button class="block relative">
    <MeatballMenuButton onClick={modal?.toggle} />
    <AccountActionsMenu bind:modal position={{ right: '0' }} classes="mt-1.5" />
</account-actions-button>
