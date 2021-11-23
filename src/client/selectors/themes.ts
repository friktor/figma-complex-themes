import { createSelector } from "@reduxjs/toolkit"

import { Collection } from "client/features/themes"
import { flatThemesMapReducer } from "./flatReducer"
import { RootState } from "client/features"
import { StyleType } from "models"

const { values } = Object

export const getCreateFormOptions = (state: RootState) => state.themes.forms.create
export const getOpened = (state: RootState) => state.themes.opened
export const getSelections = (state: RootState) => state.themes.selections
export const getSearchQuery = (state: RootState) => state.themes.search

export const getFullLibrary = (state: RootState) => state.themes.library
export const getPaintThemes = (state: RootState) => state.themes.PAINT
export const getTextThemes = (state: RootState) => state.themes.TEXT

export const getEditableStyle = (state: RootState) => state.themes.editable

export const getAvailableThemes = (state: RootState) => {
  const _reducer = (arr: string[], collection: Collection<any>): string[] => {
    if (collection.type === "theme") {
      arr.push(collection.name)
    }

    return arr
  }

  // prettier-ignore
  const themes = Array.from(
    new Set([
      ...values(state.themes.PAINT).reduce(_reducer, []),
      ...values(state.themes.TEXT).reduce(_reducer, [])
    ]),
  )

  return themes
}

export const getFlatPaintThemes = createSelector(
  [getPaintThemes, getOpened, getSearchQuery],
  (collections, opened, searchQuery) =>
    flatThemesMapReducer({
      styleType: StyleType.PAINT,
      collections,
      searchQuery,
      opened,
    }),
)

export const getFlatTextThemes = createSelector(
  [getTextThemes, getOpened, getSearchQuery],
  (collections, opened, searchQuery) =>
    flatThemesMapReducer({
      styleType: StyleType.TEXT,
      collections,
      searchQuery,
      opened,
    }),
)
