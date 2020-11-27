use std::ffi::{CStr, CString};
use std::os::raw::c_char;
use std::convert::TryInto;

use wallet_actor_system::{init as init_runtime, send_message as send_actor_message, listen as add_event_listener, EventType};

type Callback = extern "C" fn(*const c_char);

#[no_mangle]
pub extern "C" fn initialize(callback: Callback, storage_path: *const c_char) {
    let storage_path: Option<&str> = if storage_path.is_null() {
        None
    } else {
        let c_storage_path = unsafe { CStr::from_ptr(storage_path) };
        Some(c_storage_path.to_str().unwrap())
    };
    init_runtime(move |event| {
        let c_event = CString::new(event).expect("failed to convert response to CString");
        callback(c_event.as_ptr());
    }, storage_path);
}

#[no_mangle]
pub extern "C" fn send_message(message: *const c_char) {
    let c_message = unsafe {
        assert!(!message.is_null());
        CStr::from_ptr(message)
    };
    let message = c_message.to_str().unwrap();
    smol::block_on(send_actor_message(message.to_string()));
}

#[no_mangle]
pub extern "C" fn listen(id: *const c_char, event_name: *const c_char) {
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
    add_event_listener(id, event_type);
}
