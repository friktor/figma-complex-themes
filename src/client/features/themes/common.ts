import { Draft, PayloadAction } from "@reduxjs/toolkit"

import { CreateForm, ThemesState } from "./types"
import { RawStyle, SelectionEvent } from "models"
import { denormalizeStyles } from "./helpers"
import { Payload } from "./actions"

export default {
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
      state.opened[key] = true
    } else {
      delete state.opened[key]
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
