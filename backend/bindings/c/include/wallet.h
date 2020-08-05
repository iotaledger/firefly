typedef void (*Callback)(const char *response);
extern void *init();
extern void *send_message(const char *message, Callback callback);
