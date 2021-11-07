import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RawPaintStyle, RawTextStyle, SelectionEvent } from "models"
import { getCurrentThemes } from "./actions"
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

export interface SetOpenedGroup {
  // type: "paint" | "text"
  opened?: boolean
  theme: string
  group: string
}

const initialState: ThemesState = {
  openedGroups: {},
  selections: [],

  paint: {},
  text: {},
}

export const themesSlice = createSlice({
  name: "themes",
  initialState,
  reducers: {
    setSearchQuery(state, { payload }: PayloadAction<string>) {
      state.search = payload
    },
    setSelections(state, { payload }: PayloadAction<SelectionEvent[]>) {
      state.selections = payload
    },
    setGroupOpened(state, { payload }: PayloadAction<SetOpenedGroup>) {
      const { theme, group } = payload
      const key = `${theme}:${group}`

      if (payload.opened) {
        state.openedGroups[key] = true
      } else {
        delete state.openedGroups[key]
      }
    }
  },

  extraReducers: {
    [getCurrentThemes.fulfilled.toString()]: (state, { payload }) => {
      state.paint = payload.paint
      state.text = payload.text
    },
  },
})

// Action creators are generated for each case reducer function
export const { setSearchQuery, setSelections, setGroupOpened } = themesSlice.actions
export default themesSlice.reducer
