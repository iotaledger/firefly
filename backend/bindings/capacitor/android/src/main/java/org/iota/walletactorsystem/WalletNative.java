package org.iota.walletactorsystem;

import com.sun.jna.Callback;
import com.sun.jna.Library;
import com.sun.jna.Native;
import com.sun.jna.NativeLibrary;

public interface WalletNative extends Library {
    String JNA_LIBRARY_NAME = "wallet";
    NativeLibrary JNA_NATIVE_LIB = NativeLibrary.getInstance(JNA_LIBRARY_NAME);

    WalletNative INSTANCE = Native.loadLibrary(JNA_LIBRARY_NAME, WalletNative.class);

    void init();
    void send_message(String message, MessageCallback callback);

    interface MessageCallback extends Callback {
        void apply(String response);
    }
}
