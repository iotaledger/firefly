import { IActorHandler } from './bridge'
import { LoggerConfig } from './wallet'
import { IWalletApi } from './walletApi'

export interface IWalletActor {
    api: IWalletApi

    init(id: string, storagePath: string, sendCrashReports: boolean, machineId: string): IActorHandler
    onMessage(callback: (payload: unknown) => void): void
    initLogger(config: LoggerConfig): void

    migrateStrongholdSnapshotV2ToV3(
        currentPath: string,
        currentPassword: string,
        newPath: string,
        newPassword: string
    ): void
}
