use neon::prelude::*;
use std::convert::TryInto;
use std::sync::{
    mpsc::{channel, Receiver},
    Arc, Mutex,
};
use wallet_actor_system::{
    init as init_runtime, listen as add_event_listener, send_message as send_actor_message,
    EventType,
};

struct SendMessageTask {
    message: String,
}

impl Task for SendMessageTask {
    type Output = ();
    type Error = ();
    type JsEvent = JsUndefined;
    fn perform(&self) -> Result<Self::Output, Self::Error> {
        let message = &self.message;
        smol::block_on(send_actor_message(message.to_string()));
        Ok(())
    }

    fn complete(
        self,
        mut cx: TaskContext,
        _: Result<Self::Output, Self::Error>,
    ) -> JsResult<Self::JsEvent> {
        Ok(cx.undefined())
    }
}

struct ReceiveMessageTask(Arc<Mutex<Receiver<String>>>);

impl Task for ReceiveMessageTask {
    type Output = String;
    type Error = String;
    type JsEvent = JsString;

    fn perform(&self) -> Result<Self::Output, Self::Error> {
        let rx = self
            .0
            .lock()
            .map_err(|_| "Could not obtain lock on receiver".to_string())?;
        rx.recv().map_err(|e| e.to_string())
    }

    fn complete(
        self,
        mut cx: TaskContext,
        result: Result<Self::Output, Self::Error>,
    ) -> JsResult<Self::JsEvent> {
        match result {
            Ok(s) => Ok(cx.string(s)),
            Err(e) => cx.throw_error(format!("ReceiveTask error: {}", e))
        }
    }
}

pub struct ActorSystem {
    rx: Arc<Mutex<Receiver<String>>>,
}

declare_types! {
    pub class JsActorSystem for ActorSystem {
        // Called by the `JsActorSystem` constructor
        init(mut cx) {
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
            let (tx, rx) = channel();
            let wrapped_tx = Arc::new(Mutex::new(tx));

            init_runtime(move |event| {
                let tx = wrapped_tx.lock().unwrap();
                let _ = tx.send(event);
            }, storage_path);

            Ok(ActorSystem {
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
            let receive_task = ReceiveMessageTask(rx);

            // Schedule the task on the `libuv` thread pool
            receive_task.schedule(cb);

            // The `poll` method does not return any data.
            Ok(JsUndefined::new().upcast())
        }
    }
}

fn listen(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let event_name = cx.argument::<JsString>(0)?.value();
    let event_type: EventType = event_name.as_str().try_into().expect("unknown event name");
    add_event_listener(event_type);
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
    cx.export_function("sendMessage", send_message)?;
    cx.export_function("listen", listen)?;
    // Expose the `JsActorSystem` class as `ActorSystem`.
    cx.export_class::<JsActorSystem>("ActorSystem")?;

    Ok(())
});
