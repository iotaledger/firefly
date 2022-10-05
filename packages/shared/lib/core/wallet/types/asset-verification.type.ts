import { NotVerifiedStatus, VerifiedStatus } from '../enums'

export type AssetVerification =
    | { verified: true; status: VerifiedStatus }
    | { verified: false; status: NotVerifiedStatus }
