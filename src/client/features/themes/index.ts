import { createSlice, PayloadAction, Draft } from "@reduxjs/toolkit"

// prettier-ignore
import {
  RemoveCollectionParams,
  RemoveThemeGroupParams,
  ClonedPayload,

  renameCollection,
  renameThemeGroup,
  getCurrentThemes,
  removeCollection,
  removeThemeGroup,
  cloneCollection,
  cloneThemeGroup,
  createStyle,
} from "./actions"

import { RawPaintStyle, RawStyle, RawTextStyle, SelectionEvent } from "models"
import { denormalizeStyles } from "./actions/denormalize"
import { Collections } from "./types"
export * from "./actions"
export * from "./types"

export interface ThemesState {
  paint: Collections<RawPaintStyle>
  text: Collections<RawTextStyle>

  openedGroups: Record<string, boolean>
  selections?: SelectionEvent[]
  search?: string
}

interface SetOpenedGroup {
  // type: "paint" | "text"
  opened?: boolean
  group: string
  theme?: string
}

interface CreateTheme {
  type: string | "paint" | "text"
  theme: string
}

interface CreateGroup {
  type: string | "paint" | "text"
  group: string
}

interface CreateThemeGroup extends CreateTheme {
  group: string
}

const initialState: ThemesState = {
  openedGroups: {},
  selections: [],

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

  setGroupOpened(state: Draft<ThemesState>, { payload }: PayloadAction<SetOpenedGroup>) {
    const { theme, group } = payload
    const key = [theme, group].filter(x => !!x).join(":")

    if (payload.opened) {
      state.openedGroups[key] = true
    } else {
      delete state.openedGroups[key]
    }
  },

  // Styles
  createTheme(state: Draft<ThemesState>, { payload }: PayloadAction<CreateTheme>) {
    if (!state[payload.type][payload.theme]) {
      state[payload.type][payload.theme] = {
        name: payload.theme,
        type: "theme",
        groups: {},
        items: {},
      }
    }
  },

  createGroup(state: Draft<ThemesState>, { payload }: PayloadAction<CreateGroup>) {
    if (!state[payload.type][payload.group]) {
      state[payload.type][payload.group] = {
        name: payload.group,
        type: "group",
        groups: {},
        items: {},
      }
    }
  },

  createThemeGroup(state: Draft<ThemesState>, { payload }: PayloadAction<CreateThemeGroup>) {
    if (!state[payload.type][payload.theme].groups[payload.group]) {
      state[payload.type][payload.theme].groups[payload.group] = {
        name: payload.theme,
        ids: [],
      }
    }
  },
}

export const themesSlice = createSlice({
  name: "themes",
  initialState,
  reducers,

  extraReducers: {
    [getCurrentThemes.fulfilled.toString()]: (state, { payload }) => {
      denormalizeStyles(payload.paint, state.paint)
      denormalizeStyles(payload.text, state.text)
    },

    [createStyle.fulfilled.toString()]: (state, { payload }: PayloadAction<RawStyle>) => {
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

    [removeCollection.fulfilled.toString()]: (state, { payload }: PayloadAction<RemoveCollectionParams>) => {
      delete state[payload.type][payload.name]
    },

    [removeThemeGroup.fulfilled.toString()]: (state, { payload }: PayloadAction<RemoveThemeGroupParams>) => {
      const collection = state[payload.type][payload.theme]

      for (const id of collection.groups[payload.group].ids) {
        delete collection.items[id]
      }

      delete collection.groups[payload.group]
    },

    [cloneCollection.fulfilled.toString()]: (state, { payload }: PayloadAction<ClonedPayload>) => {
      denormalizeStyles(payload.styles, state[payload.type])
    },

    [cloneThemeGroup.fulfilled.toString()]: (state, { payload }: PayloadAction<ClonedPayload>) => {
      denormalizeStyles(payload.styles, state[payload.type])
    },

    [renameCollection.fulfilled.toString()]: (state, { payload }: PayloadAction<ClonedPayload>) => {
      denormalizeStyles(payload.styles, state[payload.type])
    },

    [renameThemeGroup.fulfilled.toString()]: (state, { payload }: PayloadAction<ClonedPayload>) => {
      denormalizeStyles(payload.styles, state[payload.type])
    },
  },
})

// Action creators are generated for each case reducer function
// prettier-ignore
export const {
  createThemeGroup,
  setSearchQuery,
  setGroupOpened,
  setSelections,
  createTheme,
  createGroup,
} = themesSlice.actions

export default themesSlice.reducer
