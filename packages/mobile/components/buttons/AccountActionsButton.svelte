<script lang="ts">
    import { MeatballMenuButton } from 'shared/components'
    import { DrawerId, openDrawer } from '../../lib/auxiliary/drawer'
</script>

<MeatballMenuButton onClick={() => openDrawer(DrawerId.AccountActions)} classes="items-center text-gray-500" />
