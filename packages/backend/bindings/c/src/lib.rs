use std::convert::TryInto;
use std::ffi::{CStr, CString};
use std::os::raw::c_char;
use std::sync::Mutex;

use wallet_actor_system::{
    init as init_actor, destroy as destroy_actor, listen as add_event_listener, send_message as send_actor_message,
    EventType,
};
use tokio::runtime::Runtime;
use once_cell::sync::OnceCell;

type Callback = extern "C" fn(*const c_char);

pub(crate) fn block_on<C: futures::Future>(cb: C) -> C::Output {
    static INSTANCE: OnceCell<Mutex<Runtime>> = OnceCell::new();
    let runtime = INSTANCE.get_or_init(|| Mutex::new(Runtime::new().unwrap()));
    runtime.lock().unwrap().block_on(cb)
}

#[no_mangle]
pub extern "C" fn initialize(callback: Callback, actor_id: *const c_char, storage_path: *const c_char) {
    let c_actor_id = unsafe {
        assert!(!actor_id.is_null());
        CStr::from_ptr(actor_id)
    };
    let actor_id = c_actor_id.to_str().unwrap();

    let storage_path: Option<&str> = if storage_path.is_null() {
        None
    } else {
        let c_storage_path = unsafe { CStr::from_ptr(storage_path) };
        Some(c_storage_path.to_str().unwrap())
    };
    block_on(init_actor(
        actor_id,
        move |event| {
            let c_event = CString::new(event).expect("failed to convert response to CString");
            callback(c_event.as_ptr());
        },
        storage_path,
    ));
}

#[no_mangle]
pub extern "C" fn destroy(actor_id: *const c_char) {
    let c_actor_id = unsafe {
        assert!(!actor_id.is_null());
        CStr::from_ptr(actor_id)
    };
    let actor_id = c_actor_id.to_str().unwrap();

    block_on(destroy_actor(
        actor_id,
    ));
}

#[no_mangle]
pub extern "C" fn send_message(message: *const c_char) {
    let c_message = unsafe {
        assert!(!message.is_null());
        CStr::from_ptr(message)
    };
    let message = c_message.to_str().unwrap();
    block_on(send_actor_message(message.to_string()));
}

#[no_mangle]
pub extern "C" fn listen(actor_id: *const c_char, id: *const c_char, event_name: *const c_char) {
    let c_actor_id = unsafe {
        assert!(!actor_id.is_null());
        CStr::from_ptr(actor_id)
    };
    let actor_id = c_actor_id.to_str().unwrap();
    
    let c_id = unsafe {
        assert!(!id.is_null());
        CStr::from_ptr(id)
    };
    let id = c_id.to_str().unwrap();

    let c_event_name = unsafe {
        assert!(!event_name.is_null());
        CStr::from_ptr(event_name)
    };
    let event_name = c_event_name.to_str().unwrap();

    let event_type: EventType = event_name.try_into().expect("unknown event name");
    add_event_listener(actor_id, id, event_type);
}
