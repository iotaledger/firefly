import { Router } from '../router'
import { Subrouter } from '../subrouters'

export type ParentRouter<T> = Router<T> | Subrouter<T>
