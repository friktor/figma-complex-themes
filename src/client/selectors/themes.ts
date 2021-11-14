import { createSelector } from "@reduxjs/toolkit"

import { flatThemesMapReducer } from "./flatReducer"
import { RootState } from "client/features"

export const getOpenedGroups = (state: RootState) => state.themes.openedGroups
export const getSelections = (state: RootState) => state.themes.selections
export const getSearchQuery = (state: RootState) => state.themes.search

export const getPaintThemes = (state: RootState) => state.themes.paint
export const getTextThemes = (state: RootState) => state.themes.text

export const getEditableStyle = (state: RootState) => state.themes.editable

export const getFlatPaintThemes = createSelector(
  [getPaintThemes, getOpenedGroups, getSearchQuery],
  (collections, openedGroups, searchQuery) =>
    flatThemesMapReducer({
      styleType: "paint",
      openedGroups,
      collections,
      searchQuery,
    }),
)
export const getFlatTextThemes = createSelector(
  [getTextThemes, getOpenedGroups, getSearchQuery],
  (collections, openedGroups, searchQuery) =>
    flatThemesMapReducer({
      styleType: "text",
      openedGroups,
      collections,
      searchQuery,
    }),
)

export const getFlatThemesList = createSelector([getFlatPaintThemes, getFlatTextThemes], (paint, text) => ({
  paint,
  text,
}))
