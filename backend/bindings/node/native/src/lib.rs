use neon::prelude::*;
use wallet_actor_system::{init as init_runtime, send_message as send_actor_message};

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
    cx.export_function("sendMessage", send_message)
});
