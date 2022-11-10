export interface IPincodeManager {
    set(id: string, pin: string): Promise<void>
    remove(id: string): Promise<boolean>
    verify(id: string, pin: string): Promise<boolean>
}
