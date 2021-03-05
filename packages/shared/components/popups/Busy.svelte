<script lang="typescript">
    import { Logo, Text } from 'shared/components'

    export let statusMessage = ''
</script>

<div class={"flex flex-col justify-center align-center items-center"}>
    <Logo width="50%" classes="pt-8" logo="logo-firefly-full" />
    {#if statusMessage}
        <Text type="p" classes="pt-8">{statusMessage}</Text>
    {/if}
</div>