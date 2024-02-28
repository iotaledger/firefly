<script lang="ts">
    import { BoxedIcon, FontWeight, Icon, Text, TextType } from '@ui'

    export let icon: Icon
    export let text: string
    export let boxClasses: string | undefined = undefined
</script>

<div class="flex flex-row items-center space-x-2">
    <BoxedIcon {icon} classes={boxClasses} />
    <Text color={'gray-600'} fontWeight={FontWeight.medium} fontSize={'12'} type={TextType.p}>{text}</Text>
</div>
