package org.iota.firefly.mobile.alpha;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(WebViewSettingsPlugin.class);
    super.onCreate(savedInstanceState);
  }
}
