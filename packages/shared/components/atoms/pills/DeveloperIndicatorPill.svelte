<script lang="typescript">
    import { Pill } from 'shared/components'

    export let label: string = ''
</script>

<Pill
    data={label}
    smaller
    textColor="gray-600"
    darkTextColor="white"
    backgroundColor="gray-100"
    darkBackgroundColor="gray-700"
    classes="uppercase dark:bg-opacity-20 rounded-full px-3"
/>
