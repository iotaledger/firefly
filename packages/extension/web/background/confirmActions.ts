import * as notify from '../shared/platform/notify'
import type {
  FullMsg,
} from "../shared/types";

export async function SendTransfer(msg: FullMsg) {
  notify.showNotify(msg)
}

export async function GetAccounts(msg: FullMsg) {
  notify.showNotify(msg)
}
