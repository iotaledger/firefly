import { WalletRoute } from '@core/router'

export type BottomNavigationTab = {
    icon: string
    label: string
    route: WalletRoute
    onClick: () => void
}
