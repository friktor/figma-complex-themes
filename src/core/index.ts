import { RpcHandler } from "utils/rpc/handler"
import { RpcAction } from "models"

import * as methods from "./methods"

export const rpc = new RpcHandler({
    [RpcAction.SYNC_THEME_STYLES]: methods.processStyles,
    [RpcAction.REMOVE_THEME_STYLE]: methods.removeStyle,
    [RpcAction.SYNC_THEME_STYLE]: methods.processStyle,
    [RpcAction.GET_RAW_STYLES]: methods.getRawStyles,
    
    [RpcAction.SELECT_ALL_FRAMES_BY_STYLE]: methods.selectAllFramesByStyle,
    [RpcAction.GET_CURRENT_SELECTIONS]: methods.getCurrentSelections,
    [RpcAction.ADD_TO_SELECTIONS]: methods.addToSelections,

    [RpcAction.REDRAW_FRAME]: methods.redrawFrame,

    [RpcAction.IMPORT_STYLE_FROM_FRAME_TO_THEME]: methods.importStyleFromFrameToTheme,

    [RpcAction.MERGE_SERIALIZED_THEME_WITH_CURRENT]: methods.mergeSerializedThemeWithCurrent,
    [RpcAction.SERIALIZE_CURRENT_PAGE_THEME]: methods.serializeCurrentPageTheme,
    [RpcAction.REMOVE_THEME_FROM_LIBRARY]: methods.removeThemeFromLibrary,
    [RpcAction.RENAME_LIBRARY_THEME]: methods.renameLibraryTheme,
    [RpcAction.SET_LIBRARY_THEME]: methods.setLibraryTheme,
    [RpcAction.GET_LIBRARY]: methods.getLibrary,
})
