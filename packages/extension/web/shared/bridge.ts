import EventEmitter from '../shared/events'
import type { FullMsg, Msg, FullResponse, Response } from './types'

export default class Bridge {
    private ee
    private sender:Function
    private responders: Responder[]
    private defaultTimeout:number = 5000
    constructor() {
        this.ee = new EventEmitter()
        this.onResponse = this.onResponse.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
    }
    onResponse(msg:FullMsg) {
        if (msg.id) this.ee.emit(msg.id, msg)
    }
    registerSender(f:Function){
        this.sender = f
        return this
    }
    registerResponders(rs: Responder[]) {
        this.responders = rs
        return this
    }
    setDefaultTimeout(n:number) {
        this.defaultTimeout = n
        return this
    }
    async sendMessage(msg:Msg, timeout?:number):Promise<FullResponse|Response|any> {
        if(!this.sender) return
        const t = timeout || this.defaultTimeout
        const fm = <FullMsg>{
            actorId: '', // empty for serde
            id: msg.id || generateRandomId(),
            cmd: msg.cmd,
            payload: msg.payload,
            origin: msg.origin || window.location.origin,
            from: msg.from || '', // the original origin
        }
        this.sender(fm)
        if (this.responders) {
            const r = await listenForResponse(this.ee, fm, t)
            return this._forward(fm, r)
        }
        return await listenForResponse(this.ee, fm, t)
    }
    async respond(msg:FullMsg, res:Response) {
        const fr: FullResponse = {
            id: msg.id,
            type: res.type,
            payload: res.payload,
            action: msg.cmd,
            origin: msg.origin,
        }
        this._forward(msg, fr)
    }
    async _forward(fm:FullMsg, fr:FullResponse) {
        for (let r of this.responders) {
            if(r.checker(fm.origin)) {
                r.to(fr, fm.origin)
                break;
            }
        }
    }
}

const generateRandomId = (): string => {
    return Array.from(window.crypto.getRandomValues(new Uint8Array(16)), (byte) => {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
};

function listenForResponse(ee, fm:FullMsg, timeout: number): Promise<FullResponse> {
    return new Promise((resolve, reject) => {
        let abort = setTimeout(()=>resolve(<FullResponse>{
            type:'Error', id:fm.id, action:fm.cmd
        }), timeout)
        ee.once(fm.id, (m: FullResponse) => {
            clearTimeout(abort)
            // "Error" type is a legit response too
            resolve(m)
        })
    })
}

export interface Responder {
    checker: (origin:string)=>boolean,
    to: Function
}
