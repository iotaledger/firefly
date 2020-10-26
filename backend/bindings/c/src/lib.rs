use std::ffi::{CStr, CString};
use std::os::raw::c_char;

use wallet_actor_system::{init as init_runtime, send_message as send_actor_message};

type Callback = extern "C" fn(*const c_char);

#[no_mangle]
pub extern "C" fn initialize(storage_path: *const c_char) {
    let storage_path: Option<&str> = if storage_path.is_null() {
        None
    } else {
        let c_storage_path = unsafe { CStr::from_ptr(storage_path) };
        Some(c_storage_path.to_str().unwrap())
    };
    init_runtime(storage_path);
}

#[no_mangle]
pub extern "C" fn send_message(message: *const c_char, callback: Callback) {
    let c_message = unsafe {
        assert!(!message.is_null());
        CStr::from_ptr(message)
    };
    let message = c_message.to_str().unwrap();

    let response = smol::block_on(send_actor_message(message.to_string()));
    let c_response = CString::new(response).expect("failed to convert response to CString");
    callback(c_response.as_ptr());
}
