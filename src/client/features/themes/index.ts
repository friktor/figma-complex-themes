import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RawPaintStyle, RawTextStyle } from "models"
import { getCurrentThemes } from "./actions"
import { Collections } from "./types"
export * from "./actions"
export * from "./types"

export interface ThemesState {
  paint: Collections<RawPaintStyle>,
  text: Collections<RawTextStyle>
}

const initialState: ThemesState = {
  paint: {},
  text: {},
}

export const themesSlice = createSlice({
  name: "themes",
  initialState,
  reducers: {

  },

  extraReducers: {
    [getCurrentThemes.fulfilled.toString()]: (state, { payload }) => {
      state.paint = payload.paint
      state.text = payload.text
    },
  }
})

// Action creators are generated for each case reducer function
// export const { increment, decrement } = themesSlice.actions

export default themesSlice.reducer
