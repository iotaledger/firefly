typedef void (*Callback)(const char *response);
extern void *initialize(Callback callback, const char *storage_path);
extern void *send_message(const char *message);
extern void *listen(const char *event_name);
