import { createSlice, PayloadAction, Draft } from "@reduxjs/toolkit"

import { Library, RawPaintStyle, RawStyle, RawTextStyle, SelectionEvent } from "models"
import { Collections, CreateForm, Forms } from "./types"
import { denormalizeStyles } from "./actions/helpers"
export * from "./actions"
export * from "./types"

// prettier-ignore
import {
  renameCollection,
  renameThemeGroup,
  removeCollection,
  removeThemeGroup,
  updatePaintStyle,
  removePaintStyle,
  cloneCollection,
  cloneThemeGroup,
  addPaintStyle,
  renameStyle,
  removeStyle,
  createStyle,
  getLibrary,
  getThemes,
  Payload,
} from "./actions"

export interface ThemesState {
  paint: Collections<RawPaintStyle>
  text: Collections<RawTextStyle>

  openedGroups: Record<string, boolean>
  selections: SelectionEvent[]
  library: Library

  editable?: RawStyle
  search?: string

  forms: Forms
}

const initialState: ThemesState = {
  openedGroups: {},
  selections: [],
  forms: {},

  library: {},
  paint: {},
  text: {},
}

const reducers = {
  // Utility
  setSearchQuery(state: Draft<ThemesState>, { payload }: PayloadAction<string>) {
    state.search = payload
  },

  setSelections(state: Draft<ThemesState>, { payload }: PayloadAction<SelectionEvent[]>) {
    state.selections = payload
  },

  setCreateFormOptions(state: Draft<ThemesState>, { payload }: PayloadAction<CreateForm | undefined>) {
    state.forms.create = payload
  },

  setGroupOpened(state: Draft<ThemesState>, { payload }: PayloadAction<Payload.SetOpenedGroup>) {
    const { theme, group } = payload
    const key = [theme, group].filter(x => !!x).join(":")

    if (payload.opened) {
      state.openedGroups[key] = true
    } else {
      delete state.openedGroups[key]
    }
  },

  // Styles
  createTheme(state: Draft<ThemesState>, { payload }: PayloadAction<Payload.CreateTheme>) {
    if (!state[payload.type][payload.theme]) {
      state[payload.type][payload.theme] = {
        name: payload.theme,
        type: "theme",
        groups: {},
        items: {},
      }
    }
  },

  createGroup(state: Draft<ThemesState>, { payload }: PayloadAction<Payload.CreateGroup>) {
    if (!state[payload.type][payload.group]) {
      state[payload.type][payload.group] = {
        name: payload.group,
        type: "group",
        groups: {},
        items: {},
      }
    }
  },

  createThemeGroup(state: Draft<ThemesState>, { payload }: PayloadAction<Payload.CreateThemeGroup>) {
    if (!state[payload.type][payload.theme].groups[payload.group]) {
      state[payload.type][payload.theme].groups[payload.group] = {
        name: payload.group,
        ids: [],
      }
    }
  },

  insertRawStyles(state: Draft<ThemesState>, { payload }: PayloadAction<Payload.UpdatedStyles>) {
    denormalizeStyles(payload.styles, state[payload.type])
  },

  setEditableStyle(state: Draft<ThemesState>, { payload }: PayloadAction<RawStyle | undefined>) {
    state.editable = payload as Draft<RawStyle>
  },

  updatePaintWithEditable(state: Draft<ThemesState>, { payload }: PayloadAction<Payload.UpdatedStyles>) {
    denormalizeStyles(payload.styles, state[payload.type])

    if (state.editable) {
      state.editable = payload.styles[0] as any
    }
  },
}

const extraReducers = {
  [getThemes.fulfilled.type]: (state: Draft<ThemesState>, { payload }) => {
    denormalizeStyles(payload.paint, state.paint)
    denormalizeStyles(payload.text, state.text)
  },

  [getLibrary.fulfilled.type]: (state: Draft<ThemesState>, { payload }: PayloadAction<Library>) => {
    state.library = payload
  },

  [createStyle.fulfilled.type]: (state: Draft<ThemesState>, { payload }: PayloadAction<RawStyle>) => {
    const { theme, group, id } = payload.base
    const type = payload.inner.type.toLowerCase() as "paint" | "text"

    if (theme) {
      const _createTheme = { type, theme }
      const _createThemeGroup = { ..._createTheme, group }

      reducers.createTheme(state, { payload: _createTheme } as any)
      reducers.createThemeGroup(state, { payload: _createThemeGroup } as any)

      state[type][theme].items[id] = payload as any
      state[type][theme].groups[group].ids.push(id)
    } else {
      const _createGroup = { type, group }
      reducers.createGroup(state, { payload: _createGroup } as any)
      state[type][group].items[id] = payload as any
    }
  },

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

  [removeStyle.fulfilled.type]: (state: Draft<ThemesState>, { payload }: PayloadAction<Payload.RemoveStyle>) => {
    const collection = state[payload.type][payload.collection]
    const style = collection.items[payload.id]

    if (style.base.theme) {
      const { ids } = collection.groups[style.base.group]
      collection.groups[style.base.group].ids = ids.filter(id => id !== style.base.id)
    }

    delete collection.items[style.base.id]
  },

  [renameCollection.fulfilled.type]: reducers.insertRawStyles,
  [renameThemeGroup.fulfilled.type]: reducers.insertRawStyles,
  [renameStyle.fulfilled.type]: reducers.insertRawStyles,

  [cloneCollection.fulfilled.type]: reducers.insertRawStyles,
  [cloneThemeGroup.fulfilled.type]: reducers.insertRawStyles,

  [addPaintStyle.fulfilled.type]: reducers.updatePaintWithEditable,
  [updatePaintStyle.fulfilled.type]: reducers.updatePaintWithEditable,
  [removePaintStyle.fulfilled.type]: reducers.updatePaintWithEditable,
}

export const themesSlice = createSlice({
  name: "themes",
  initialState,

  extraReducers,
  reducers,
})

// Action creators are generated for each case reducer function
// prettier-ignore
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
