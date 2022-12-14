<script lang="typescript">
    import { Modal, ProposalDetailsMenu, MeatballMenuButton } from 'shared/components'

    let modal: Modal
</script>

<div class="max-h-7 max-w-9 flex-none flex-initial overflow-visible relative">
    <MeatballMenuButton onClick={modal?.toggle} />
    <ProposalDetailsMenu bind:modal position={{ right: '0' }} classes="mt-1.5" />
</div>
