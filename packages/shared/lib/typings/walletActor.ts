import type { IActorHandler } from './bridge'
import type { LoggerConfig } from './wallet'
import type { IWalletApi } from './walletApi'

export interface IWalletActor {
    api: IWalletApi

    init(id: string, storagePath: string, sendCrashReports: boolean, machineId: string): IActorHandler
    onMessage(callback: (payload: unknown) => void): void
    initLogger(config: LoggerConfig): void
}
