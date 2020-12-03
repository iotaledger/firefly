typedef void (*Callback)(const char *response);

extern "C" {

void initialize(Callback callback, const char *storage_path);
void send_message(const char *message);
void listen(const char *event_name);

} // extern "C"
