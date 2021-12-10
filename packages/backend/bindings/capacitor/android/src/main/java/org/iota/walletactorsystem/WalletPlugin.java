package org.iota.walletactorsystem;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.Arrays;
import org.iota.wallet.Actor;
import org.iota.wallet.ActorCallback;
import org.iota.wallet.EventType;
import org.iota.wallet.local.*;

@CapacitorPlugin(name = "WalletPlugin")
public class WalletPlugin extends Plugin {

    @Override
    public void load() {
        NativeAPI.verifyLink();
    }
    private boolean isInitialized = false;

    @PluginMethod
    public void initialize(final PluginCall call) {
        if (isInitialized) return;
        if (!call.getData().has("actorId")) {
            call.reject("actorId is required");
            return;
        }
        String actorId = call.getString("actorId");
        call.setKeepAlive(true);

        final ActorCallback callback = response -> {
            System.out.println("walletEvent " + response);
            JSObject walletResponse = new JSObject();
            walletResponse.put("walletResponse", response);
            notifyListeners("walletEvent", walletResponse);
        };

        Actor.iotaInitialize(callback, actorId, "./database");
        isInitialized = true;
    }

    @PluginMethod()
    public void sendMessage(final PluginCall call) {
        try {
            if (!call.getData().has("message")) {
                call.reject("message is required");
                return;
            }
            Actor.iotaSendMessage(call.getObject("message").toString());
            call.resolve();
        } catch (Exception ex) {
            call.reject(ex.getMessage() + Arrays.toString(ex.getStackTrace()));
        }
    }

    @PluginMethod
    public void destroy(final PluginCall call) {
        if (isInitialized) return;
        try {
            if (!call.getData().has("actorId")) {
                call.reject("actorId is required");
                return;
            }
            String actorId = call.getString("actorId");
            Actor.iotaDestroy(actorId);
        } catch (Exception ex) {
            call.reject(ex.getMessage() + Arrays.toString(ex.getStackTrace()));
        }
    }

    @PluginMethod
    public void listen(final PluginCall call) {
        if (isInitialized) return;
        try {
            if (!call.getData().has("actorId")
                    || !call.getData().has("id")
                    || !call.getData().has("event")) {
                call.reject("actorId, id and event are required");
                return;
            }
            String actorId = call.getString("actorId");
            //String event = call.getString("event");
            Actor.iotaListen(actorId, "", EventType.valueOf("ERROR_THROWN"));
        } catch (Exception ex) {
            call.reject(ex.getMessage() + Arrays.toString(ex.getStackTrace()));
        }
    }
}
