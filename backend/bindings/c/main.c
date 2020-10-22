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
  initialize(callback, NULL);
  listen("ErrorThrown");
  send_message("{ \"cmd\": \"SetStrongholdPassword\", \"payload\": \"password\" }");
  send_message("{ \"cmd\": \"CreateAccount\", \"payload\": { \"clientOptions\": { \"node\": \"https://nodes.devnet.iota.org:443\" } } }");
  return 0;
}
