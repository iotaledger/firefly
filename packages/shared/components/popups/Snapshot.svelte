<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'

    export let locale
    export let dashboard = true
</script>

<Text type="h4" classes="mb-5">{locale('popups.snapshot.title')}</Text>
<Text type="p" secondary>
    {locale('popups.snapshot.body')}
    {locale(`popups.snapshot.${dashboard ? 'bodyFirefly' : 'bodyMigration'}`)}
</Text>
<div class="flex w-full justify-center pt-8">
    <Button classes="w-1/2" onClick={() => Electron.close()}>{locale('actions.closeFirefly')}</Button>
</div>
