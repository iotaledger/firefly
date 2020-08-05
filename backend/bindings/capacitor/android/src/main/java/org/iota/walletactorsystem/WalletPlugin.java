package org.iota.walletactorsystem;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import org.json.JSONException;

@NativePlugin()
public class WalletPlugin extends Plugin {

    @Override
    public void load() {
        super.load();
        WalletNative.INSTANCE.init();
    }

    @PluginMethod()
    public void sendMessage(final PluginCall call) {
        try {
            WalletNative.INSTANCE.send_message("message from Capacitor", new WalletNative.MessageCallback() {
                @Override
                public void apply(String response) {
                    try {
                        JSObject res = new JSObject(response);
                        call.resolve(res);
                    } catch (JSONException ex) {
                        JSObject res = new JSObject();
                        res.put("response", response);
                        call.resolve(res);
                    }
                }
            });
        } catch (Exception ex) {
            call.reject(ex.getMessage() + ex.getStackTrace().toString());
        }
    }
}
