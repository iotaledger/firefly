<script lang="typescript">
    import { Text, Input, Button, Password, Checkbox } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'

    export let addCustomNode = ({ url, username, password }, primary) => {}
    export let locale

    let url = ''
    let username = ''
    let password = ''
    let primary = false
</script>

<Text type="h4" classes="mb-5">{locale('popups.node.title_add')}</Text>
<div class="w-full h-full flex flex-col justify-between">
    <Input classes="mb-6" bind:value={url} placeholder={locale('popups.node.node_address')} />
    <Input classes="mb-6" bind:value={username} placeholder={locale('popups.node.optional_username')} />
    <Password classes="mb-6" bind:value={password} placeholder={locale('popups.node.optional_password')} />
    <Checkbox classes="mb-8" label={locale('popups.node.set_as_primary_node')} bind:checked={primary} />
</div>
<div class="flex flex-row justify-between space-x-4 w-full px-8 ">
    <Button secondary classes="w-1/2" onClick={() => closePopup()}>{locale('actions.cancel')}</Button>
    <Button disabled={!url} classes="w-1/2" onClick={() => addCustomNode({ url, username, password }, primary)}>
        {locale('actions.add_node')}
    </Button>
</div>
