<script lang="typescript">
    import { Modal, AccountActionsMenu } from 'shared/components'
    import { KebabButton } from './'

    export let classes = ''

    let modal: Modal
</script>

<KebabButton onClick={modal?.toggle} {classes} />
<AccountActionsMenu bind:modal />
