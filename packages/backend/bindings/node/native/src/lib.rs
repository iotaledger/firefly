use neon::prelude::*;
use once_cell::sync::OnceCell;
use std::convert::TryInto;
use std::sync::{
    mpsc::{channel, Receiver},
    Arc, Mutex,
};
use tokio::runtime::Runtime;
use wallet_actor_system::{
    destroy as destroy_actor, init as init_actor, init_logger as init_backend_logger,
    listen as add_event_listener, send_message as send_actor_message, EventType,
    LoggerConfigBuilder,
};

pub(crate) fn block_on<C: futures::Future>(cb: C) -> C::Output {
    static INSTANCE: OnceCell<Mutex<Runtime>> = OnceCell::new();
    let runtime = INSTANCE.get_or_init(|| Mutex::new(Runtime::new().unwrap()));
    runtime.lock().unwrap().block_on(cb)
}

struct SendMessageTask {
    message: String,
}

impl Task for SendMessageTask {
    type Output = ();
    type Error = ();
    type JsEvent = JsUndefined;
    fn perform(&self) -> Result<Self::Output, Self::Error> {
        let message = &self.message;
        block_on(send_actor_message(message.to_string()));
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
            Err(e) => cx.throw_error(format!("ReceiveTask error: {}", e)),
        }
    }
}

pub struct ActorSystem {
    actor_id: String,
    rx: Arc<Mutex<Receiver<String>>>,
}

declare_types! {
    pub class JsActorSystem for ActorSystem {
        // Called by the `JsActorSystem` constructor
        init(mut cx) {
            let actor_id = cx.argument::<JsString>(0)?.value();
            let storage_path = match cx.argument_opt(1) {
                Some(arg) => {
                    Some(arg.downcast::<JsString>().or_throw(&mut cx)?.value())
                }
                None => None,
            };
            let (tx, rx) = channel();
            let wrapped_tx = Arc::new(Mutex::new(tx));

            block_on(init_actor(actor_id.to_string(), move |event| {
                let tx = wrapped_tx.lock().unwrap();
                let _ = tx.send(event);
            }, storage_path));

            Ok(ActorSystem {
                actor_id,
                rx: Arc::new(Mutex::new(rx)),
            })
        }

        method destroy(mut cx) {
            let this = cx.this();
            let actor_id = cx.borrow(&this, |emitter| emitter.actor_id.clone());
            block_on(destroy_actor(actor_id));
            Ok(cx.undefined().upcast())
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
    let actor_id = cx.argument::<JsString>(0)?.value();
    let id = cx.argument::<JsString>(1)?.value();
    let event_name = cx.argument::<JsString>(2)?.value();
    let event_type: EventType = event_name.as_str().try_into().expect("unknown event name");
    add_event_listener(actor_id, id, event_type);
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

pub fn init_logger(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let config = cx.argument::<JsString>(0)?.value();
    let config: LoggerConfigBuilder = serde_json::from_str(&config).expect("invalid logger config");
    init_backend_logger(config);
    Ok(cx.undefined())
}

register_module!(mut cx, {
    cx.export_function("sendMessage", send_message)?;
    cx.export_function("listen", listen)?;
    cx.export_function("initLogger", init_logger)?;
    // Expose the `JsActorSystem` class as `ActorSystem`.
    cx.export_class::<JsActorSystem>("ActorSystem")?;

    Ok(())
});
