import type { IActorHandler } from './bridge'
import type { LoggerConfig } from './wallet'
import type { IWalletApi } from './walletApi'

export interface IWalletActor {
    init(id: string, storagePath: string, sendCrashReports: boolean, machineId: string): IActorHandler
    initLogger(config: LoggerConfig): void

    onResponse(callback: (payload: unknown) => void): void

    api: IWalletApi
}
