import { createSlice, PayloadAction, Draft } from "@reduxjs/toolkit"

import { denormalizeStyles } from "./helpers"
import { ThemesState } from "./types"
import { Library } from "models"
export * from "./actions"
export * from "./types"

import { getLibrary, getThemes } from "./actions"
import collectionReducers from "./collections"
import commonReducers from "./common"
import styleReducers from "./style"

const initialState: ThemesState = {
  selections: [],
  opened: {},
  forms: {},

  library: {},

  PAINT: {},
  TEXT: {},
}

const extraReducers = {
  [getThemes.fulfilled.type]: (state: Draft<ThemesState>, { payload }) => {
    denormalizeStyles(payload.paint, state.PAINT)
    denormalizeStyles(payload.text, state.TEXT)
  },

  [getLibrary.fulfilled.type]: (state: Draft<ThemesState>, { payload }: PayloadAction<Library>) => {
    state.library = payload
  },

  ...collectionReducers,
  ...styleReducers,
}

export const themesSlice = createSlice({
  name: "themes",
  initialState,

  reducers: commonReducers,
  extraReducers,
})

// Action creators are generated for each case reducer function
export const {
  setCreateFormOptions,
  setEditableStyle,
  insertRawStyles,
  createThemeGroup,
  setSearchQuery,
  setGroupOpened,
  setSelections,
  createTheme,
  createGroup,
} = themesSlice.actions

export default themesSlice.reducer
