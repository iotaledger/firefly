<script lang="typescript">
    import { Text, ExpirationTimePickerMenu, Modal } from 'shared/components'
    export let value: string
    export let expireDate: Date
    let menu: ExpirationTimePickerMenu
    let selected: 'none' | '1hour' | '1day' | '1week' = 'none'
    let anchor: HTMLElement
</script>

<button class="flex items-center justify-center cursor-pointer" on:click={menu?.tryOpen} bind:this={anchor}>
    <Text highlighted classes="hover:text-blue-600">
        {value}
    </Text>
</button>
<ExpirationTimePickerMenu bind:this={menu} bind:value bind:selected bind:expireDate bind:anchor />
