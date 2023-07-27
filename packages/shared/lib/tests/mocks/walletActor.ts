import { IWalletActor } from '../../typings/walletActor'
import { LoggerConfig } from '../../typings/wallet'
import { IActorHandler } from '../../typings/bridge'

const walletActor: IWalletActor = {
    api: undefined,
    init(id: string, storagePath: string, sendCrashReports: boolean, machineId: string): IActorHandler {
        return undefined
    },
    initLogger(config: LoggerConfig): void {},
    onMessage(callback: (payload: unknown) => void): void {},
    migrateStrongholdSnapshotV2ToV3(
        currentPath: string,
        currentPassword: string,
        newPath: string,
        newPassword: string
    ) {},
}

window['__WALLET__'] = walletActor
