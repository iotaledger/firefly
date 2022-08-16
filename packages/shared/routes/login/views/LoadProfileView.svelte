<script lang="ts">
    import { LoadingScreen } from 'shared/components'

    const statusMessage = 'Loading...?'
</script>

<div class={'flex flex-col justify-center align-center items-center'}>
    <LoadingScreen {statusMessage} />
</div>
