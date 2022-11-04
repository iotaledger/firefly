<script lang="typescript">
    import { Drawer } from '../../../../components'

    export let onClose: () => unknown = () => {}

    let title: string
    let allowBack: boolean
    const fullScreen: boolean = true
</script>

<Drawer {onClose} {title} {fullScreen} {allowBack} enterFromSide={true}>
    <h1>Profile Actions</h1>
</Drawer>
