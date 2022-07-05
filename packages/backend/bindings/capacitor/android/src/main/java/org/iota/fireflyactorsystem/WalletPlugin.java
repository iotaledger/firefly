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
        try {
            NativeAPI.verifyLink();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private boolean isInitialized = false;
    private static final Object lock = new Object();

    @PluginMethod()
    public void initialize(final PluginCall call) {
        if (isInitialized) {
            return;
        }
        if (!call.getData().has("actorId") || !call.getData().has("storagePath")) {
            call.reject("actorId & storagePath are required");
        }
        String actorId = call.getString("actorId");
        String storagePath = call.getString("storagePath");
        assert actorId != null && storagePath != null;
        String dbPath = getContext().getFilesDir() + storagePath;

        try {
            final ActorCallback callback = response -> {
                JSObject walletResponse = new JSObject();
                walletResponse.put("walletResponse", response);
                notifyListeners("walletEvent", walletResponse);
            };

            call.setKeepAlive(true);
            Actor.iotaInitialize(callback, actorId, dbPath);
            isInitialized = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PluginMethod()
    public void sendMessage(final PluginCall call) {
        try {
            if (!call.getData().has("message")) {
                call.reject("message is required");
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
            call.resolve();
            return;
        }
        try {
            if (!call.getData().has("actorId")) {
                call.reject("actorId is required");
            }
            String actorId = call.getString("actorId");
            assert actorId != null;

            Actor.iotaDestroy(actorId);
            isInitialized = false;
            call.release(bridge);
        } catch (Exception ex) {
            call.reject(ex.getMessage() + Arrays.toString(ex.getStackTrace()));
        }
    }

    @PluginMethod()
    public void listen(final PluginCall call) {
        if (!isInitialized) {
            call.resolve();
            return;
        }
        if (!call.getData().has("actorId")
                || !call.getData().has("id")
                || !call.getData().has("event")) {
            call.reject("actorId, id and event are required");
        }
        String actorId = call.getString("actorId");
        String id = call.getString("id");
        String event = call.getString("event");
        assert actorId != null && id != null && event != null;
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
