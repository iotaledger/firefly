<script>
    import { Text, Button } from 'shared/components'
    export let locale
    export let active
    export let data // message

    function handleCancelClick() {
        active = false
    }
</script>

<div class="flex justify-center w-full flex-row flex-wrap">
    <Text type="h3" classes="mb-5">{data}</Text>
    <div class="flex flex-row justify-between px-2 w-full">
        <Button secondary classes="w-full" onClick={handleCancelClick}>{locale('actions.cancel')}</Button>
    </div>
</div>