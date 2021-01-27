typedef void (*Callback)(const char *response);

extern "C" {

void initialize(Callback callback, const char *actor_id, const char *storage_path);
void destroy(const char *actor_id);
void send_message(const char *message);
void listen(const char *actor_id, const char *id, const char *event_name);

} // extern "C"
