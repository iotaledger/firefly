package org.iota.walletactorsystem;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import org.json.JSONException;

@NativePlugin()
public class WalletPlugin extends Plugin {

    @PluginMethod
    public void initialize(final PluginCall call) {
        WalletNative.INSTANCE.initialize(new WalletNative.MessageCallback(){
            @Override
            public void apply(String response) {
                try {
                    notifyListeners("walletMessageReceived", new JSObject(response));
                } catch (Exception e) {
                    // an exception here is unexpected since the backend always returns a JSON
                }
            }
        }, call.getString("storagePath"));
    }

    @PluginMethod()
    public void sendMessage(final PluginCall call) {
        try {
            WalletNative.INSTANCE.send_message(call.getObject("message").toString());
            call.resolve(new JSObject());
        } catch (Exception ex) {
            call.reject(ex.getMessage() + ex.getStackTrace().toString());
        }
    }

    @PluginMethod
    public void listen(final PluginCall call) {
        try {
            WalletNative.INSTANCE.listen(call.getString("eventName"));
        } catch (Exception ex) {
            call.reject(ex.getMessage() + ex.getStackTrace().toString());
        }
    }
}
