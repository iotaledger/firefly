typedef void (*Callback)(const char *response);
extern void *initialize();
extern void *send_message(const char *message, Callback callback);
