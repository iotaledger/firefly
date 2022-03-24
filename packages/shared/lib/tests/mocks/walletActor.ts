import { IWalletActor } from '@lib/typings/walletActor'
import { LoggerConfig } from '@lib/typings/wallet'
import { IActorHandler } from '@core/actor'

const walletActor: IWalletActor = {
    api: undefined,
    init(id: string, storagePath: string, sendCrashReports: boolean, machineId: string): IActorHandler {
        return undefined
    },
    initLogger(config: LoggerConfig): void {},
    onMessage(callback: (payload: unknown) => void): void {},
}

window['__WALLET__'] = walletActor
