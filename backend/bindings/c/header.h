typedef void (*Callback)(const char *response);

extern "C" {

void initialize();
void send_message(const char *message, Callback callback);
void listen(const char *event_name, Callback callback);

} // extern "C"
