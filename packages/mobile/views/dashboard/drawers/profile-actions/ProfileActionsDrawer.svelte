<script lang="typescript">
    import { Drawer, ProfileHeader } from '../../../../components'

    export let onClose: () => unknown = () => {}

    const title: string = 'Profile'
    const allowBack: boolean = true
    const fullScreen: boolean = true
</script>

<Drawer {onClose} {title} {fullScreen} {allowBack} enterFromSide={true} onBackClick={onClose}>
    <ProfileHeader />
</Drawer>
