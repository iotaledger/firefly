import { Icon } from '../enums'
import { ISvg } from '../interfaces'
import {
    ACTIVITY_SVG,
    ALIAS_SVG,
    ARROW_LEFT_SVG,
    ARROW_RIGHT_SVG,
    ASSEMBLY_SVG,
    BACKSPACE_SVG,
    BELL_SVG,
    BIOMETRIC_SVG,
    CALENDAR_SVG,
    CHECKBOX_SVG,
    CHECKBOX_ROUND_SVG,
    CHECKBOX_UNCHECKED_SVG,
    CHECKBOX_UNCHECKED_ROUND_SVG,
    CHECKMARK_SVG,
    CHECKMARK_FILLED_SVG,
    CHEVRON_DOWN_SVG,
    CHEVRON_LEFT_SVG,
    CHEVRON_RIGHT_SVG,
    CHEVRON_UP_SVG,
    CHIP_SVG,
    CLOSE_SVG,
    CLOSE_THIN_SVG,
    COPY_SVG,
    COLLECTIBLES_APPLICATION_LARGE_SVG,
    COLLECTIBLES_APPLICATION_SMALL_SVG,
    COLLECTIBLES_AUDIO_LARGE_SVG,
    COLLECTIBLES_AUDIO_SMALL_SVG,
    COLLECTIBLES_FONT_LARGE_SVG,
    COLLECTIBLES_FONT_SMALL_SVG,
    COLLECTIBLES_IMAGE_LARGE_SVG,
    COLLECTIBLES_IMAGE_SMALL_SVG,
    COLLECTIBLES_MODEL_LARGE_SVG,
    COLLECTIBLES_MODEL_SMALL_SVG,
    COLLECTIBLES_TEXT_LARGE_SVG,
    COLLECTIBLES_TEXT_SMALL_SVG,
    COLLECTIBLES_UNKNOWN_LARGE_SVG,
    COLLECTIBLES_UNKNOWN_SMALL_SVG,
    COLLECTIBLES_VIDEO_LARGE_SVG,
    COLLECTIBLES_VIDEO_SMALL_SVG,
    COLLECTIBLES_SVG,
    CURRENCY_SVG,
    CUSTOMIZE_SVG,
    DELETE_SVG,
    DEV_SVG,
    DISCORD_SVG,
    DOC_SVG,
    DOUBLE_CHEVRON_RIGHT_SVG,
    EDIT_SVG,
    ERROR_FILLED_SVG,
    EXCLAMATION_FILLED_SVG,
    EXCLAMATION_SVG,
    EXPIRATION_TIME_SVG,
    EXPORT_SVG,
    FILE_SVG,
    FILTER_SVG,
    FIREFLY_SVG,
    GOVERNANCE_SVG,
    HAMBURGER_SVG,
    HELP_SVG,
    HIDE_SVG,
    HISTORY_SVG,
    INFO_FILLED_SVG,
    INFO_SVG,
    IOTA_SVG,
    LANGUAGE_SVG,
    LEDGER_APP_SVG,
    LEDGER_APP_LEGACY_SVG,
    LEDGER_SVG,
    LINK_SVG,
    LOCK2_SVG,
    LOCK3_SVG,
    LOCK_SVG,
    LOGOUT_SVG,
    MAXIMIZE_SVG,
    MINIMIZE_SVG,
    MINUS_SVG,
    NETWORK_SVG,
    NODE_SVG,
    PARCHMENT_SVG,
    PICTURE_SVG,
    PLAY_SVG,
    PLUS_SVG,
    PROFILE_SVG,
    QR_SVG,
    RADIO_SVG,
    RADIO_UNCHECKED_SVG,
    RECEIVE_SVG,
    REFRESH_SVG,
    RESET_SVG,
    RESTORE_SIZE_SVG,
    SEARCH_SVG,
    SECURITY_SVG,
    SEED_SVG,
    SEND_SVG,
    SETTINGS_SVG,
    SHIELD_SVG,
    SHIMMER_SVG,
    SHIMMER_EVM_SVG,
    SMALL_CHEVRON_DOWN_SVG,
    SMALL_CHEVRON_LEFT_SVG,
    SMALL_CHEVRON_RIGHT_SVG,
    SMALL_CHEVRON_UP_SVG,
    SPEECH_SVG,
    STAKING_SVG,
    STATUS_ERROR_SVG,
    STATUS_SUCCESS_SVG,
    SUCCESS_CHECK_SVG,
    SYNC_SVG,
    THEME_DARK_SVG,
    THEME_SVG,
    THEME_LIGHT_SVG,
    TIMELOCK_SVG,
    TIMER_SVG,
    TOKENS_SVG,
    TOOLS_SVG,
    TRANSFER_SVG,
    TROPHY_SVG,
    UNLOCK_SVG,
    VIEW_SVG,
    VOTED_SVG,
    VOTING_SVG,
    WALLET_SVG,
    WARNING_FILLED_SVG,
    WARNING_SVG,
    WIFI_SVG,
    WORK_SVG,
    VERIFIED_SVG,
    NOT_VERIFIED_SVG,
    VERIFICATION_STATUS_SELF,
    VERIFICATION_STATUS_NEW,
} from '../svgs'
import { VERIFICATION_STATUS_OFFICIAL } from '../svgs/verification-status-official.svg'

type IconSvgMap = { [key in Icon]: ISvg }

export const ICON_SVG_MAP: IconSvgMap = {
    [Icon.Activity]: ACTIVITY_SVG,
    [Icon.Alias]: ALIAS_SVG,
    [Icon.ArrowLeft]: ARROW_LEFT_SVG,
    [Icon.ArrowRight]: ARROW_RIGHT_SVG,
    [Icon.Assembly]: ASSEMBLY_SVG,
    [Icon.Backspace]: BACKSPACE_SVG,
    [Icon.Bell]: BELL_SVG,
    [Icon.Biometric]: BIOMETRIC_SVG,
    [Icon.Calendar]: CALENDAR_SVG,
    [Icon.Checkbox]: CHECKBOX_SVG,
    [Icon.CheckboxRound]: CHECKBOX_ROUND_SVG,
    [Icon.CheckboxUnchecked]: CHECKBOX_UNCHECKED_SVG,
    [Icon.CheckboxUncheckedRound]: CHECKBOX_UNCHECKED_ROUND_SVG,
    [Icon.Checkmark]: CHECKMARK_SVG,
    [Icon.CheckmarkFilled]: CHECKMARK_FILLED_SVG,
    [Icon.ChevronDown]: CHEVRON_DOWN_SVG,
    [Icon.ChevronLeft]: CHEVRON_LEFT_SVG,
    [Icon.ChevronRight]: CHEVRON_RIGHT_SVG,
    [Icon.ChevronUp]: CHEVRON_UP_SVG,
    [Icon.Chip]: CHIP_SVG,
    [Icon.Close]: CLOSE_SVG,
    [Icon.CloseThin]: CLOSE_THIN_SVG,
    [Icon.CollectiblesApplicationLarge]: COLLECTIBLES_APPLICATION_LARGE_SVG,
    [Icon.CollectiblesApplicationSmall]: COLLECTIBLES_APPLICATION_SMALL_SVG,
    [Icon.CollectiblesAudioLarge]: COLLECTIBLES_AUDIO_LARGE_SVG,
    [Icon.CollectiblesAudioSmall]: COLLECTIBLES_AUDIO_SMALL_SVG,
    [Icon.CollectiblesFontLarge]: COLLECTIBLES_FONT_LARGE_SVG,
    [Icon.CollectiblesFontSmall]: COLLECTIBLES_FONT_SMALL_SVG,
    [Icon.CollectiblesImageLarge]: COLLECTIBLES_IMAGE_LARGE_SVG,
    [Icon.CollectiblesImageSmall]: COLLECTIBLES_IMAGE_SMALL_SVG,
    [Icon.CollectiblesModelLarge]: COLLECTIBLES_MODEL_LARGE_SVG,
    [Icon.CollectiblesModelSmall]: COLLECTIBLES_MODEL_SMALL_SVG,
    [Icon.CollectiblesTextLarge]: COLLECTIBLES_TEXT_LARGE_SVG,
    [Icon.CollectiblesTextSmall]: COLLECTIBLES_TEXT_SMALL_SVG,
    [Icon.CollectiblesUnknownLarge]: COLLECTIBLES_UNKNOWN_LARGE_SVG,
    [Icon.CollectiblesUnknownSmall]: COLLECTIBLES_UNKNOWN_SMALL_SVG,
    [Icon.CollectiblesVideoLarge]: COLLECTIBLES_VIDEO_LARGE_SVG,
    [Icon.CollectiblesVideoSmall]: COLLECTIBLES_VIDEO_SMALL_SVG,
    [Icon.Collectibles]: COLLECTIBLES_SVG,
    [Icon.Copy]: COPY_SVG,
    [Icon.Currency]: CURRENCY_SVG,
    [Icon.Customize]: CUSTOMIZE_SVG,
    [Icon.Delete]: DELETE_SVG,
    [Icon.Dev]: DEV_SVG,
    [Icon.Discord]: DISCORD_SVG,
    [Icon.Doc]: DOC_SVG,
    [Icon.DoubleChevronRight]: DOUBLE_CHEVRON_RIGHT_SVG,
    [Icon.Edit]: EDIT_SVG,
    [Icon.ErrorFilled]: ERROR_FILLED_SVG,
    [Icon.Exclamation]: EXCLAMATION_SVG,
    [Icon.ExclamationFilled]: EXCLAMATION_FILLED_SVG,
    [Icon.ExpirationTime]: EXPIRATION_TIME_SVG,
    [Icon.Export]: EXPORT_SVG,
    [Icon.File]: FILE_SVG,
    [Icon.Filter]: FILTER_SVG,
    [Icon.Firefly]: FIREFLY_SVG,
    [Icon.Governance]: GOVERNANCE_SVG,
    [Icon.Hamburger]: HAMBURGER_SVG,
    [Icon.Help]: HELP_SVG,
    [Icon.Hide]: HIDE_SVG,
    [Icon.History]: HISTORY_SVG,
    [Icon.Info]: INFO_SVG,
    [Icon.InfoFilled]: INFO_FILLED_SVG,
    [Icon.Iota]: IOTA_SVG,
    [Icon.Language]: LANGUAGE_SVG,
    [Icon.Ledger]: LEDGER_SVG,
    [Icon.LedgerApp]: LEDGER_APP_SVG,
    [Icon.LedgerAppLegacy]: LEDGER_APP_LEGACY_SVG,
    [Icon.Link]: LINK_SVG,
    [Icon.Lock]: LOCK_SVG,
    [Icon.Lock2]: LOCK2_SVG,
    [Icon.Lock3]: LOCK3_SVG,
    [Icon.Logout]: LOGOUT_SVG,
    [Icon.Maximize]: MAXIMIZE_SVG,
    [Icon.Minimize]: MINIMIZE_SVG,
    [Icon.Minus]: MINUS_SVG,
    [Icon.Network]: NETWORK_SVG,
    [Icon.Node]: NODE_SVG,
    [Icon.NotVerified]: NOT_VERIFIED_SVG,
    [Icon.Parchment]: PARCHMENT_SVG,
    [Icon.Picture]: PICTURE_SVG,
    [Icon.Play]: PLAY_SVG,
    [Icon.Plus]: PLUS_SVG,
    [Icon.Profile]: PROFILE_SVG,
    [Icon.Qr]: QR_SVG,
    [Icon.Radio]: RADIO_SVG,
    [Icon.RadioUnchecked]: RADIO_UNCHECKED_SVG,
    [Icon.Receive]: RECEIVE_SVG,
    [Icon.Refresh]: REFRESH_SVG,
    [Icon.Reset]: RESET_SVG,
    [Icon.RestoreSize]: RESTORE_SIZE_SVG,
    [Icon.Search]: SEARCH_SVG,
    [Icon.Security]: SECURITY_SVG,
    [Icon.Seed]: SEED_SVG,
    [Icon.Send]: SEND_SVG,
    [Icon.Settings]: SETTINGS_SVG,
    [Icon.Shield]: SHIELD_SVG,
    [Icon.Shimmer]: SHIMMER_SVG,
    [Icon.ShimmerEvm]: SHIMMER_EVM_SVG,
    [Icon.SmallChevronDown]: SMALL_CHEVRON_DOWN_SVG,
    [Icon.SmallChevronLeft]: SMALL_CHEVRON_LEFT_SVG,
    [Icon.SmallChevronRight]: SMALL_CHEVRON_RIGHT_SVG,
    [Icon.SmallChevronUp]: SMALL_CHEVRON_UP_SVG,
    [Icon.Speech]: SPEECH_SVG,
    [Icon.Staking]: STAKING_SVG,
    [Icon.StatusError]: STATUS_ERROR_SVG,
    [Icon.StatusSuccess]: STATUS_SUCCESS_SVG,
    [Icon.SuccessCheck]: SUCCESS_CHECK_SVG,
    [Icon.Sync]: SYNC_SVG,
    [Icon.Theme]: THEME_SVG,
    [Icon.ThemeDark]: THEME_DARK_SVG,
    [Icon.ThemeLight]: THEME_LIGHT_SVG,
    [Icon.Timelock]: TIMELOCK_SVG,
    [Icon.Timer]: TIMER_SVG,
    [Icon.Tokens]: TOKENS_SVG,
    [Icon.Tools]: TOOLS_SVG,
    [Icon.Transfer]: TRANSFER_SVG,
    [Icon.Trophy]: TROPHY_SVG,
    [Icon.Unlock]: UNLOCK_SVG,
    [Icon.VerificationStatusNew]: VERIFICATION_STATUS_NEW,
    [Icon.VerificationStatusOfficial]: VERIFICATION_STATUS_OFFICIAL,
    [Icon.VerificationStatusSelf]: VERIFICATION_STATUS_SELF,
    [Icon.Verified]: VERIFIED_SVG,
    [Icon.View]: VIEW_SVG,
    [Icon.Voted]: VOTED_SVG,
    [Icon.Voting]: VOTING_SVG,
    [Icon.Wallet]: WALLET_SVG,
    [Icon.Warning]: WARNING_SVG,
    [Icon.WarningFilled]: WARNING_FILLED_SVG,
    [Icon.Wifi]: WIFI_SVG,
    [Icon.Work]: WORK_SVG,
}