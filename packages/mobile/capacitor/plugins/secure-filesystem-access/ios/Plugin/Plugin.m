#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(SecureFilesystemAccess, "SecureFilesystemAccess",
    CAP_PLUGIN_METHOD(launchFolderPicker, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(launchFilePicker, CAPPluginReturnPromise);
)