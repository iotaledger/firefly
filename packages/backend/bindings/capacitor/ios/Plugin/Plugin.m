#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(WalletPlugin, "WalletPlugin",
    CAP_PLUGIN_METHOD(sendMessage, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(destroy, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(initialize, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(listen, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(migrateStrongholdSnapshotV2ToV3, CAPPluginReturnPromise);
)
