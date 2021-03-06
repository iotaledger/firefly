<script lang="typescript">
    import { Text, QR } from 'shared/components'
    export let locale
    export let data
</script>

<Text type="h4" classes="mb-5">{locale('popups.password.title')}</Text>
<div class="flex justify-center w-full">
    <QR {data} />
</div>
