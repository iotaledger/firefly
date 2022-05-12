import Foundation
import Capacitor
import UniformTypeIdentifiers

@available(iOS 13.0, *)
@objc(SecureFilesystemAccess)
public class SecureFilesystemAccess: CAPPlugin, UIDocumentPickerDelegate {

    public var _call: CAPPluginCall? = nil
    public var _url: URL? = nil
    public var fileName: String = ""

    @objc func showPicker(_ call: CAPPluginCall){
        call.keepAlive = true
        self._call = call
        guard let pickerType = call.getString("type") else {
            return call.reject("type is required")
        }
        self.fileName = call.getString("defaultPath") ?? ""
        
        DispatchQueue.main.async { [self] in
            var documentPicker: UIDocumentPickerViewController? = nil
            if #available(iOS 14.0, *) {
                if (pickerType == "file") {
                    let strongholdType: UTType = UTType("org.iota.firefly-stronghold")!
                    documentPicker = UIDocumentPickerViewController(
                        forOpeningContentTypes: [strongholdType], asCopy: true)
                } else if (pickerType == "folder") {
                    documentPicker = UIDocumentPickerViewController(
                        forOpeningContentTypes: [.folder])
                }
            } else {
                documentPicker = UIDocumentPickerViewController(
                    documentTypes: pickerType == "file" 
                        ? ["org.iota.firefly-stronghold"]
                        : ["public.folder"],
                    in: UIDocumentPickerMode.open)
            }
            documentPicker!.allowsMultipleSelection = false
            documentPicker!.shouldShowFileExtensions = true
            documentPicker!.delegate = self
            documentPicker!.modalPresentationStyle = UIModalPresentationStyle.formSheet
            self.bridge?.viewController?.present(documentPicker!, animated: true, completion: nil)
        }
    }
    
    public func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt url: [URL]) {
        self._url = url[0]
        if (self.fileName != "") {
            self._call?.resolve([ "selected": url[0].relativePath + "/" + fileName ])
        } else {
            self._call?.resolve([ "selected": url[0].relativePath ])
        }
    }

    @objc func allowAccess(_ call: CAPPluginCall) {
        guard self._url!.startAccessingSecurityScopedResource() else {
            call.reject("failed to access the security-scoped resource!")
            return
        }
        call.resolve()
    }

    @objc func revokeAccess(_ call: CAPPluginCall) {
        self._url!.stopAccessingSecurityScopedResource()
        self._url = nil
        self._call?.keepAlive = false
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
    
    @objc func saveRecoveryKit(_ call: CAPPluginCall) {
        guard let selectedPath = call.getString("selectedPath") else {
            return call.reject("selectedPath is required")
        }
        guard let fromRelativePath = call.getString("fromRelativePath") else {
            return call.reject("fromRelativePath is required")
        }
        let _url = (self.bridge?.config.appLocation.path)! + fromRelativePath // "/assets/docs/recovery-kit.pdf"
        let srcUrl = Capacitor.URL(fileURLWithPath: _url, isDirectory: false)
        let dstUrl = Capacitor.URL(fileURLWithPath: selectedPath, isDirectory: true)
        try? FileManager.default.copyItem(at: srcUrl, to: dstUrl)
        call.resolve()
    }
}
