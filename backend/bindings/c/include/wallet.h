typedef void (*Callback)(const char *response);
extern void *initialize();
extern void *send_message(const char *message, Callback callback);
extern void *listen(const char *event_name, Callback callback);
