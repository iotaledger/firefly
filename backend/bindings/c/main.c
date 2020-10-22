#include "include/wallet.h"
#include <stdio.h>
#include <string.h>
#include <unistd.h>

void callback(const char *message) {
  printf("Response message received: %s\n", message);
  fflush(stdout);
}

void listener(const char *message) {
  printf("Listener got: %s\n", message);
  fflush(stdout);
}

int main() {
  initialize(NULL);
  listen("ErrorThrown", listener);
  send_message("{ \"cmd\": \"SetStrongholdPassword\", \"payload\": \"password\" }", callback);
  send_message("{ \"cmd\": \"CreateAccount\", \"payload\": { \"clientOptions\": { \"node\": \"https://nodes.devnet.iota.org:443\" } } }", callback);
  return 0;
}
