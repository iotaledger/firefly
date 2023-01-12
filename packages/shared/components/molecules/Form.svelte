<script lang="typescript">
    export let id: string
    export let autocomplete: 'on' | 'off' = 'off'
    export let classes: string
    export let onSubmit: () => Promise<void> = async () => {}

    let isBusy = false

    async function handleSubmit(): Promise<void> {
        isBusy = true
        await onSubmit()
        isBusy = false
    }
</script>

<form {id} {autocomplete} class={classes} on:submit|preventDefault|trusted={handleSubmit}>
    <slot {isBusy} />
</form>
