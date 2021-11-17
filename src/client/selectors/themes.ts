import { createSelector } from "@reduxjs/toolkit"

import { Collection } from "client/features/themes"
import { flatThemesMapReducer } from "./flatReducer"
import { RootState } from "client/features"

const { values } = Object

export const getCreateFormOptions = (state: RootState) => state.themes.forms.create
export const getOpenedGroups = (state: RootState) => state.themes.openedGroups
export const getSelections = (state: RootState) => state.themes.selections
export const getSearchQuery = (state: RootState) => state.themes.search

export const getFullLibrary = (state: RootState) => state.themes.library
export const getPaintThemes = (state: RootState) => state.themes.paint
export const getTextThemes = (state: RootState) => state.themes.text

export const getEditableStyle = (state: RootState) => state.themes.editable

export const getAvailableThemes = (state: RootState) => {
  const _reducer = (arr: string[], collection: Collection<any>): string[] => {
    if (collection.type === "theme") {
      arr.push(collection.name)
    }

    return arr
  }

  const themes = Array.from(
    new Set([...values(state.themes.paint).reduce(_reducer, []), ...values(state.themes.text).reduce(_reducer, [])]),
  )

  return themes
}

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
