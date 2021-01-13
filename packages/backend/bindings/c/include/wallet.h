typedef void (*Callback)(const char *response);
extern void *initialize(Callback callback, const char *actor_id, const char *storage_path);
extern void *destroy(const char *actor_id);
extern void *send_message(const char *message);
extern void *listen(const char *actor_id, const char *id, const char *event_name);
