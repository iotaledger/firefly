<script lang="typescript">
    import { Modal, ProposalsDetailsMenu, MeatballMenuButton } from 'shared/components'

    let modal: Modal
</script>

<div class="max-h-7 max-w-9 flex-none flex-initial overflow-visible relative">
    <MeatballMenuButton onClick={modal?.toggle} />
    <ProposalsDetailsMenu bind:modal position={{ right: '0' }} classes="mt-1.5" />
</div>
