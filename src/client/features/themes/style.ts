import { Draft, PayloadAction } from "@reduxjs/toolkit"

import { ThemesState } from "./types"
import { RawStyle } from "models"
import common from "./common"

import {
  updatePaintStyle,
  removePaintStyle,
  addPaintStyle,
  renameStyle,
  removeStyle,
  createStyle,
  Payload,
} from "./actions"

export default {
  [createStyle.fulfilled.type]: (state: Draft<ThemesState>, { payload }: PayloadAction<RawStyle>) => {
    const { theme, group, id } = payload.base
    const type = payload.inner.type

    if (theme) {
      const _createTheme = { type, theme }
      const _createThemeGroup = { ..._createTheme, group }

      common.createTheme(state, { payload: _createTheme } as any)
      common.createThemeGroup(state, { payload: _createThemeGroup } as any)

      state[type][theme].items[id] = payload as any
      state[type][theme].groups[group].ids.push(id)
    } else {
      const _createGroup = { type, group }
      common.createGroup(state, { payload: _createGroup } as any)
      state[type][group].items[id] = payload as any
    }
  },

  [removeStyle.fulfilled.type]: (state: Draft<ThemesState>, { payload }: PayloadAction<Payload.RemoveStyle>) => {
    const collection = state[payload.type][payload.collection]
    const style = collection.items[payload.id]

    if (style.base.theme) {
      const { ids } = collection.groups[style.base.group]
      collection.groups[style.base.group].ids = ids.filter(id => id !== style.base.id)
    }

    delete collection.items[style.base.id]
  },

  [updatePaintStyle.fulfilled.type]: common.updatePaintWithEditable,
  [removePaintStyle.fulfilled.type]: common.updatePaintWithEditable,
  [addPaintStyle.fulfilled.type]: common.updatePaintWithEditable,
  [renameStyle.fulfilled.type]: common.insertRawStyles,
}
