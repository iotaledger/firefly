#include "include/wallet.h"
#include <stdio.h>
#include <string.h>
#include <unistd.h>

void callback(const char *message) {
  printf("Response message received: %s\n", message);
  fflush(stdout);
}

int main() {
  init();
  send_message("{ \"cmd\": \"CreateAccount\", \"payload\": { \"id\": \"account_id\", \"clientOptions\": { \"node\": \"https://nodes.devnet.iota.org:443\" } } }", callback);
  return 0;
}
