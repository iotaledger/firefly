import { BridgeMessage } from './bridge-message.type'

export type Bridge = (message: BridgeMessage) => Promise<string>
