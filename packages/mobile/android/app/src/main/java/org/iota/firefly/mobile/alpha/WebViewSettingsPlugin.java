package org.iota.firefly.mobile.alpha;

import android.content.Context;
import android.util.Log;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.getcapacitor.Plugin;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;

@CapacitorPlugin(name = "WebViewSettings")
public class WebViewSettingsPlugin extends Plugin {
    @Override
    public void load() {
        WebView webView = getBridge().getWebView();

        WebSettings settings = webView.getSettings();
        settings.setGeolocationEnabled(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setDatabaseEnabled(false);
        settings.setAppCacheEnabled(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
    }

    /**
     * Clean the RAM cache used by the webView including cache files on:
     * app/cache/WebView/* folder. Called when the app is no longer visible
     * to the user, as onDestroy is not called every time the app exit.
     */
    @Override
    public void handleOnStop() {
        super.handleOnStop();
        WebView webView = getBridge().getWebView();
        webView.clearCache(true);
    }
}
