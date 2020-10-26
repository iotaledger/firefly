typedef void (*Callback)(const char *response);
extern void *initialize(const char *storagePath);
extern void *send_message(const char *message, Callback callback);
