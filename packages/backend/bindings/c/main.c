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
  initialize(callback, "my-actor", "./storage");
  listen("my-actor", "", "ErrorThrown");
  send_message("{ \"actorId\": \"my-actor\", \"id\": \"A\", \"cmd\": \"SetStrongholdPassword\", \"payload\": \"password\" }");
  send_message("{ \"actorId\": \"my-actor\", \"id\": \"AA\", \"cmd\": \"StoreMnemonic\", \"payload\": { \"signerType\": { \"type\": \"Stronghold\" } } }");
  send_message("{ \"actorId\": \"my-actor\", \"id\": \"B\", \"cmd\": \"CreateAccount\", \"payload\": { \"clientOptions\": { \"node\": \"https://nodes.devnet.iota.org:443\" } }, \"signerType\": { \"type\": \"Stronghold\" } }");
  return 0;
}
