use neon::prelude::*;
use wallet_actor_system::{init as init_runtime, send_message as send_actor_message, listen as add_event_listener, EventType};
use std::sync::{
    mpsc::{Receiver, channel},
    Arc, Mutex,
};

struct SendMessageTask {
    message: String,
}

impl Task for SendMessageTask {
    type Output = String;
    type Error = String;
    type JsEvent = JsString;
    fn perform(&self) -> Result<Self::Output, Self::Error> {
        let message = &self.message;
        let response = smol::block_on(send_actor_message(message.to_string()));
        Ok(response)
    }
    fn complete(
        self,
        mut cx: TaskContext,
        result: Result<Self::Output, Self::Error>,
    ) -> JsResult<Self::JsEvent> {
        Ok(cx.string(result.unwrap()))
    }
}

struct ListenTask(Arc<Mutex<Receiver<String>>>);

impl Task for ListenTask {
    type Output = String;
    type Error = String;
    type JsEvent = JsString;

    fn perform(&self) -> Result<Self::Output, Self::Error> {
        let rx = self.0.lock().map_err(|_| "Could not obtain lock on receiver".to_string())?;
        rx.recv().map_err(|e| e.to_string())
    }
    fn complete(self, mut cx: TaskContext, result: Result<Self::Output, Self::Error>) -> JsResult<Self::JsEvent> {
        Ok(cx.string(result.expect("channel closed")))
    }
}

pub struct EventEmitter {
    rx: Arc<Mutex<Receiver<String>>>,
}

declare_types! {
    pub class JsEventEmitter for EventEmitter {
        // Called by the `JsEventEmitter` constructor
        init(mut cx) {
            let event_name = cx.argument::<JsString>(0)?.value();
            let event_type = match event_name.as_str() {
                "Error" => EventType::Error,
                "BalanceChange"=> EventType::BalanceChange,
                "NewTransaction"=> EventType::NewTransaction,
                "ConfirmationStateChange"=> EventType::ConfirmationStateChange,
                "Reattachment"=> EventType::Reattachment,
                "Broadcast"=> EventType::Broadcast,
                _ => panic!(format!("invalid event name {}", event_name))
            };
            let (tx, rx) = channel();
            let wrapped_tx = Arc::new(Mutex::new(tx));
            add_event_listener(event_type, move |event| {
                let tx = wrapped_tx.lock().unwrap();
                let _ = tx.send(event);
            });

            Ok(EventEmitter {
                rx: Arc::new(Mutex::new(rx)),
            })
        }

        // This method should be called by JS to receive data. It accepts a
        // `function (err, data)` style asynchronous callback. It may be called
        // in a loop, but care should be taken to only call it once at a time.
        method poll(mut cx) {
            // The callback to be executed when data is available
            let cb = cx.argument::<JsFunction>(0)?;
            let this = cx.this();

            // Create an asynchronously `EventEmitterTask` to receive data
            let rx = cx.borrow(&this, |emitter| Arc::clone(&emitter.rx));
            let emitter = ListenTask(rx);

            // Schedule the task on the `libuv` thread pool
            emitter.schedule(cb);

            // The `poll` method does not return any data.
            Ok(JsUndefined::new().upcast())
        }
    }
}

fn init(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let storage_path = match cx.argument::<JsString>(0) {
        Ok(path) => {
            if path.value() == "".to_string() {
                None
            } else {
                Some(path.value())
            }
        }
        Err(_) => None,
    };
    init_runtime(storage_path);
    Ok(cx.undefined())
}

fn send_message(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let message = cx.argument::<JsString>(0)?;
    let callback = cx.argument::<JsFunction>(1)?;
    let task = SendMessageTask {
        message: message.value(),
    };
    task.schedule(callback);
    Ok(cx.undefined())
}

register_module!(mut cx, {
    cx.export_function("init", init)?;
    cx.export_function("sendMessage", send_message)?;
    // Expose the `JsEventEmitter` class as `EventEmitter`.
    cx.export_class::<JsEventEmitter>("EventEmitter")?;

    Ok(())
});
