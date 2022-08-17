import Foundation
import Capacitor
import Wallet

@objc(WalletPlugin)
public class WalletPlugin: CAPPlugin {

    private var isInitialized: Bool = false

    @objc func initialize(_ call: CAPPluginCall) {
        do {
            guard !isInitialized else { return }
            guard let actorId = call.getString("actorId"),
                let storagePath = call.getString("storagePath") else {
                return call.reject("actorId and storagePath are required")
            }
            let fm = FileManager.default
            let documents = fm.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
            let path = documents.appendingPathComponent(storagePath, isDirectory: true).path
            if !fm.fileExists(atPath: path) {
                try fm.createDirectory(atPath: path, withIntermediateDirectories: true, attributes: nil)
            }
            try path.setResourceValue(true, forKey: NSURLIsExcludedFromBackupKey)
            call.keepAlive = true
            // TODO: it's possible to make this better? investigate for implications
            // based on: https://vmanot.com/context-capturing-c-function-pointers-in-swift
            typealias cCallback = Optional<@convention(c) (Optional<UnsafePointer<CChar>>) -> ()>
            func cFunction(_ block: (@escaping @convention(block) (Optional<UnsafePointer<Int8>>) -> ())) -> (cCallback) {
                return unsafeBitCast(imp_implementationWithBlock(block), to: (cCallback).self)
            }
            let callback: cCallback = cFunction { result in
                let data: String = String(cString: result!)
                self.notifyListeners("walletEvent", data: ["walletResponse": data])
            }
            Wallet.iota_initialize(callback, actorId.cString(using: .utf8), path.cString(using: .utf8))
            call.resolve()
            isInitialized = true
        } catch {
            call.reject("failed to initialize stronghold")
        }
    }

    @objc func destroy(_ call: CAPPluginCall) {
        guard isInitialized else {
            call.resolve()
            return
        }
        guard let actorId = call.getString("actorId") else {
            return call.reject("actorId is required")
        }
        Wallet.iota_destroy(actorId.cString(using: .utf8))
        isInitialized = false
        call.resolve()
        // TODO: we need to release calls? verify if is automatically removed as are saved
    }

    @objc func sendMessage(_ call: CAPPluginCall) {
        guard let message = call.getObject("message") else {
            return call.reject("message is required")
        }
        guard JSONSerialization.isValidJSONObject(message) else {
            return call.reject("Invalid JSON object")
        }
        let jsonData = try? JSONSerialization.data(withJSONObject: message)
        // TODO: replacing for urls slashes temporaly, make better using Codable structs with URL type?
        let jsonString = String(data: jsonData!, encoding: .utf8)!.replacingOccurrences(of: "\\", with: "")
        iota_send_message(jsonString)
        call.resolve()
    }

    @objc func listen(_ call: CAPPluginCall) {
        guard isInitialized else {
            call.resolve()
            return
        }
        guard let actorId = call.getString("actorId") else {
            return call.reject("actorId is required")
        }
        guard let id = call.getString("id") else {
            return call.reject("id is required")
        }
        guard let event = call.getString("event") else {
            return call.reject("event is required")
        }
        Wallet.iota_listen(actorId, id, event)
        call.resolve()
    }
}
