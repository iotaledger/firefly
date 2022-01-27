#[derive(Debug)]
pub enum NoiseError {
    DecryptionError,
    UnsupportedMessageLengthError,
    ExhaustedNonceError,
    InvalidKeyError,
    InvalidPublicKeyError,
    EmptyKeyError,
    InvalidInputError,
    DerivePublicKeyFromEmptyKeyError,
    Hex(hex::FromHexError),
    MissingnsError,
    MissingneError,
    MissingHsMacError,
    MissingrsError,
    MissingreError
}

impl std::fmt::Display for NoiseError {
    #[inline]
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match *self {
            NoiseError::DecryptionError => write!(f, "Unsuccesful decryption."),
            NoiseError::UnsupportedMessageLengthError => write!(f, "Unsupported Message Length."),
            NoiseError::ExhaustedNonceError => write!(f, "Reached maximum number of messages that can be sent for this session."),
            NoiseError::DerivePublicKeyFromEmptyKeyError => write!(f, "Unable to derive PublicKey."),
            NoiseError::InvalidKeyError => write!(f, "Invalid Key."),
            NoiseError::InvalidPublicKeyError => write!(f, "Invalid Public Key."),
            NoiseError::EmptyKeyError => write!(f, "Empty Key."),
            NoiseError::InvalidInputError => write!(f, "Invalid input length."),
            NoiseError::MissingnsError => write!(f, "Invalid message length."),
            NoiseError::MissingHsMacError => write!(f, "Invalid message length."),
            NoiseError::MissingneError => write!(f, "Invalid message length."),
            NoiseError::MissingrsError => write!(f, "Invalid message length."),
            NoiseError::MissingreError => write!(f, "Invalid message length."),
            NoiseError::Hex(ref e) => e.fmt(f),
        }
    }
}