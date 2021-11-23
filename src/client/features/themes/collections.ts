import { Draft, PayloadAction } from "@reduxjs/toolkit"

import { ThemesState } from "./types"
import common from "./common"

import {
  renameCollection,
  renameThemeGroup,
  removeCollection,
  removeThemeGroup,
  cloneCollection,
  cloneThemeGroup,
  Payload,
} from "./actions"

export default {
  [removeCollection.fulfilled.type]: (
    state: Draft<ThemesState>,
    { payload }: PayloadAction<Payload.RemoveCollection>,
  ) => {
    delete state[payload.type][payload.name]
  },

  [removeThemeGroup.fulfilled.type]: (
    state: Draft<ThemesState>,
    { payload }: PayloadAction<Payload.RemoveThemeGroup>,
  ) => {
    const collection = state[payload.type][payload.theme]

    for (const id of collection.groups[payload.group].ids) {
      delete collection.items[id]
    }

    delete collection.groups[payload.group]
  },

  [renameCollection.fulfilled.type]: common.insertRawStyles,
  [renameThemeGroup.fulfilled.type]: common.insertRawStyles,

  [cloneCollection.fulfilled.type]: common.insertRawStyles,
  [cloneThemeGroup.fulfilled.type]: common.insertRawStyles,
}
