<script lang="typescript">
    import { Modal, AccountActionsMenu, MeatballMenuButton } from 'shared/components'

    let modal: Modal
</script>

<MeatballMenuButton onClick={modal?.toggle} includeBackground />
<AccountActionsMenu bind:modal />
