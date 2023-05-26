#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(SecureFilesystemAccess, "SecureFilesystemAccess",
    CAP_PLUGIN_METHOD(showPicker, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(allowAccess, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(revokeAccess, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(removeProfileFolder, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(renameProfileFolder, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(listProfileFolders, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(saveTextFile, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(copyFile, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(deleteFile, CAPPluginReturnPromise);
)