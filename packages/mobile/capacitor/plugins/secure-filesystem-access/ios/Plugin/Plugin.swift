import Foundation
import Capacitor
import MobileCoreServices

@objc(SecureFilesystemAccess)
public class SecureFilesystemAccess: CAPPlugin, UIDocumentPickerDelegate {

    public var _call: CAPPluginCall? = nil
    public var _url: URL? = nil

    @objc func showPicker(_ call: CAPPluginCall){
        call.keepAlive = true
        self._call = call
        guard let pickerType = call.getString("type") else {
            return call.reject("actorId is required")
        }
        
        DispatchQueue.main.async {
            let documentPicker = UIDocumentPickerViewController(
                documentTypes: pickerType == "file" 
                    ? ["org.iota.firefly-stronghold"] // [String(kUTTypeItem)] 
                    : [String(kUTTypeFolder)],
                in: UIDocumentPickerMode.open
            )
            documentPicker.allowsMultipleSelection = false
            if #available(iOS 13.0, *) {
                documentPicker.shouldShowFileExtensions = true
            }
            documentPicker.delegate = self
            documentPicker.modalPresentationStyle = UIModalPresentationStyle.formSheet
            self.bridge?.viewController?.present(documentPicker, animated: true, completion: nil)
        }
    }
    
    public func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt url: [URL]) {
        _url = url[0]
        self._call?.resolve([
            "selected": [url[0].relativePath]
        ])
    }

    @objc func allowAccess(_ call: CAPPluginCall) {
        guard _url!.startAccessingSecurityScopedResource() else {
            call.reject("failed to access the security-scoped resource!")
            return
        }
        call.resolve()
    }

    @objc func revokeAccess(_ call: CAPPluginCall) {
        _url!.stopAccessingSecurityScopedResource()
        _url = nil
        _call?.keepAlive = false
        call.resolve()
    }

    public func getAppPath(folder: String) -> URL {
        let fm = FileManager.default
        let documents = fm.urls(for: .documentDirectory, in: .userDomainMask).first!
        let appPath = documents.appendingPathComponent("__storage__/" + folder, isDirectory: true)
        return appPath
    }
    
    @objc func removeProfileFolder(_ call: CAPPluginCall) {
        guard let folder = call.getString("folder") else {
            return call.reject("folder is required")
        }
        
        let fileUrl = getAppPath(folder: folder)
        if FileManager.default.fileExists(atPath: fileUrl.path) {
            try? FileManager.default.removeItem(atPath: fileUrl.path)
        }
        call.resolve()
    }

    @objc func renameProfileFolder(_ call: CAPPluginCall) {
        guard let oldName = call.getString("oldName") else {
            return call.reject("oldName is required")
        }
        guard let newName = call.getString("newName") else {
            return call.reject("newName is required")
        }
        let srcUrl = getAppPath(folder: oldName)
        let dstUrl = getAppPath(folder: newName)
        try? FileManager.default.moveItem(at: srcUrl, to: dstUrl)
        call.resolve()
    }

    @objc func listProfileFolders(_ call: CAPPluginCall) {
        guard let folder = call.getString("folder") else {
            return call.reject("folder is required")
        }
        let fileUrl = getAppPath(folder: folder)
        let result = try? FileManager.default.contentsOfDirectory(at: fileUrl, includingPropertiesForKeys: nil, options: [])
        call.resolve(["result": result!])
    }
}
