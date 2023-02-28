<script lang="ts">
    import { MeatballMenuButton } from '@ui'

    import { DrawerId, openDrawer } from '@/auxiliary/drawer'
</script>

<MeatballMenuButton onClick={() => openDrawer(DrawerId.AccountActions)} classes="items-center text-gray-500" />
