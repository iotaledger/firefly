import { IWalletApi } from '@core/api'

import { IActorHandler } from '@core/actor'
import { LoggerConfig } from './wallet'

export interface IWalletActor {
    api: IWalletApi

    init(id: string, storagePath: string, sendCrashReports: boolean, machineId: string): IActorHandler
    onMessage(callback: (payload: unknown) => void): void
    initLogger(config: LoggerConfig): void
}
