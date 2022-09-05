<script lang="typescript">
    import { Animation } from 'shared/components'

    export let animation: string
</script>

<ledger-animation class="w-full max-h-48 flex flex-col justify-center items-center transform translate-y-4">
    <Animation width="100%" height="100%" animation="ledger-bg-desktop" classes="absolute" />
    <Animation {animation} />
</ledger-animation>
