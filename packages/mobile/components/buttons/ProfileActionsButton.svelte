<script>
    import { activeProfile } from '@core/profile'
    import { getInitials } from '@lib/helpers'

    // @TODO fix the linting error that profileInitial isn't used
    /* eslint-disable @typescript-eslint/no-unused-vars */
    $: profileInitial = getInitials($activeProfile?.name, 1)
</script>

<button class="w-10 h-10 relative flex items-center justify-center rounded-full bg-blue-500 leading-100">
    <span class="text-12 text-center text-white uppercase">{profileInitial}</span>
</button>
