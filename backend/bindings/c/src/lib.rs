use std::ffi::{CStr, CString};
use std::os::raw::c_char;

use wallet_actor_system::{init as init_runtime, send_message as send_actor_message};

type Callback = fn(*const c_char);

#[no_mangle]
pub extern "C" fn init() {
    std::thread::spawn(|| smol::block_on(init_runtime()));
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
