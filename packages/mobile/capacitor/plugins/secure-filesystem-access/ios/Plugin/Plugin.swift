import Foundation
import Capacitor
import UniformTypeIdentifiers

@available(iOS 13.0, *)
@objc(SecureFilesystemAccess)
public class SecureFilesystemAccess: CAPPlugin, UIDocumentPickerDelegate {

    private var _call: CAPPluginCall? = nil
    private var pickerType: String = ""
    
    @objc func showPicker(_ call: CAPPluginCall){
        call.keepAlive = true
        self._call = call
        pickerType = call.getString("type") ?? "folder"
        
        DispatchQueue.main.async { [self] in
            var documentPicker: UIDocumentPickerViewController? = nil
            if #available(iOS 14.0, *) {
                if (pickerType == "file") {
                    let strongholdType: UTType = UTType("org.iota.firefly-stronghold")!
                    documentPicker = UIDocumentPickerViewController(
                        forOpeningContentTypes: [strongholdType], asCopy: true)
                } else if (pickerType == "folder") {
                    documentPicker = UIDocumentPickerViewController(
                        documentTypes: ["public.folder"],
                        in: UIDocumentPickerMode.open)
                }
            } else {
                documentPicker = UIDocumentPickerViewController(
                    documentTypes: pickerType == "file" 
                        ? ["org.iota.firefly-stronghold"]
                        : ["public.folder"],
                    in: UIDocumentPickerMode.open) // for export pdf! in: UIDocumentPickerMode.exportToService
            }
            documentPicker!.allowsMultipleSelection = false
            documentPicker!.shouldShowFileExtensions = true
            documentPicker!.delegate = self
            documentPicker!.modalPresentationStyle = UIModalPresentationStyle.formSheet
            self.bridge?.viewController?.present(documentPicker!, animated: true, completion: nil)
        }
    }
    
    // This method responds when the user selects the file or folder.
    public func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt url: [URL]) {
        self._call?.resolve(["selected": [url[0].relativePath]])
        
        if (self.pickerType == "file") {
            // iOS 14 with `asCopy: true` doesn't need permission
            return
        }
        
        guard url[0].startAccessingSecurityScopedResource() else {
            self._call?.reject("failed to access the security-scoped resource!")
            return
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 60.0) {
            url[0].stopAccessingSecurityScopedResource()
            self._call?.keepAlive = false
            self._call?.resolve()
            return
        }
    }
}
