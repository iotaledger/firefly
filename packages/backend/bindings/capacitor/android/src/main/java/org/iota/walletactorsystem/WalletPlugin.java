package org.iota.fireflyactorsystem;

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
    private static final Object lock = new Object();

    @PluginMethod()
    public void initialize(final PluginCall call) {
        if (isInitialized) return;
        if (!call.getData().has("actorId") || !call.getData().has("storagePath")) {
            call.reject("actorId & storagePath are required");
            return;
        }
        String actorId = call.getString("actorId");
        String storagePath = call.getString("storagePath");
        String dbPath = getContext().getFilesDir() + storagePath;

        final ActorCallback callback = response -> {
            JSObject walletResponse = new JSObject();
            walletResponse.put("walletResponse", response);
            notifyListeners("walletEvent", walletResponse);
        };

        call.setKeepAlive(true);
        Actor.iotaInitialize(callback, actorId, dbPath);
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

    @PluginMethod()
    public void destroy(final PluginCall call) {
        if (!isInitialized) {
            call.reject("Wallet is not initialized yet");
            return;
        }
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

    @PluginMethod()
    public void listen(final PluginCall call) {
        if (!isInitialized) {
            call.reject("Wallet is not initialized yet");
            return;
        }
        if (!call.getData().has("actorId")
                || !call.getData().has("id")
                || !call.getData().has("event")) {
            call.reject("actorId, id and event are required");
            return;
        }
        String actorId = call.getString("actorId");
        String id = call.getString("id");
        String event = call.getString("event");
        if (event == null) {
            call.reject("event is null");
            return;
        }
        String snakedEvent = event.replaceAll("([a-z])([A-Z]+)", "$1_$2").toUpperCase();

        synchronized (lock) {
            try {
                Actor.iotaListen(actorId, id, EventType.valueOf(snakedEvent));
            } catch (Exception ex) {
                call.reject(ex.getMessage() + Arrays.toString(ex.getStackTrace()));
            }
        }
    }
}
