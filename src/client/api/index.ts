import { DeepMutable, ImportStylesOptions, Library, LibraryRenameOptions, RawStyle, RedrawOptions, RpcAction, SelectionEvent, SerializedTheme } from "models"
import { RpcOrchestrationService } from "utils/rpc/caller"

export const RpcService = new RpcOrchestrationService()

// Register methods reply
window.onmessage = RpcService.matcher

interface RawStyles {
    paintStyles: DeepMutable<PaintStyle>[],
    textStyles: DeepMutable<TextStyle>[],
}

export const importStyleFromFrameToTheme = RpcService.addMethod<ImportStylesOptions, undefined>(RpcAction.IMPORT_STYLE_FROM_FRAME_TO_THEME)
export const mergeSerializedThemeWithCurrent = RpcService.addMethod<SerializedTheme, any>(RpcAction.MERGE_SERIALIZED_THEME_WITH_CURRENT)
export const serializeCurrentPageTheme = RpcService.addMethod<undefined, SerializedTheme>(RpcAction.SERIALIZE_CURRENT_PAGE_THEME)
export const removeThemeFromLibrary = RpcService.addMethod<SerializedTheme, undefined>(RpcAction.REMOVE_THEME_FROM_LIBRARY)
export const selectAllFramesByStyle = RpcService.addMethod<string, SelectionEvent[]>(RpcAction.SELECT_ALL_FRAMES_BY_STYLE)
export const getCurrentSelection = RpcService.addMethod<undefined, SelectionEvent[]>(RpcAction.GET_CURRENT_SELECTIONS)
export const renameLibraryTheme = RpcService.addMethod<LibraryRenameOptions, Library>(RpcAction.RENAME_LIBRARY_THEME)
export const addToSelections = RpcService.addMethod<string, SelectionEvent[]>(RpcAction.ADD_TO_SELECTIONS)
export const setLibraryTheme = RpcService.addMethod<SerializedTheme, Library>(RpcAction.SET_LIBRARY_THEME)
export const syncThemeStyles = RpcService.addMethod<RawStyle[], RawStyle[]>(RpcAction.SYNC_THEME_STYLES)
export const removeThemeStyle = RpcService.addMethod<string, undefined>(RpcAction.REMOVE_THEME_STYLE)
export const syncThemeStyle = RpcService.addMethod<RawStyle, RawStyle>(RpcAction.SYNC_THEME_STYLE)
export const redrawFrame = RpcService.addMethod<RedrawOptions, undefined>(RpcAction.REDRAW_FRAME)
export const getRawStyles = RpcService.addMethod<undefined, RawStyles>(RpcAction.GET_RAW_STYLES)
export const getLibrary = RpcService.addMethod<undefined, Library>(RpcAction.GET_LIBRARY)