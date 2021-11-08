import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "client/features"
import { RawStyle } from "models"
const { keys } = Object 

export const flatThemesMapReducer = (
  collections: any,
  openedGroups: Record<string, boolean>,
  searchQuery?: string,
) => {
  const hasSearchQuery = searchQuery && searchQuery.length > 1
  const isContainSearch = (name) => name.includes(searchQuery)
  const isOpened = (key) => openedGroups[key]
  const result = []

  const themeKeys = []
  const groupKeys = []

  for (const collectionName of keys(collections)) {
    const collection = collections[collectionName]

    if (collection.type === "theme") {
      themeKeys.push(collectionName)
    } else {
      groupKeys.push(collectionName)
    }
  }

  // Stack for group collection type
  for (const groupName of groupKeys) {
    const group = collections[groupName]

    result.push({
      type: "GROUP_HEADER", 
      title: group.name,
      group: group.name,
    })

    if (!isOpened(group.name) && !hasSearchQuery) {
      continue
    }

    let foundedCount = 0
    for (const style of Object.values<RawStyle>(group.items)) {
      if (hasSearchQuery && !isContainSearch(style.base.name)) {
        continue
      }

      result.push({
        type: "STYLE_ITEM",
        group: group.name,
        id: style.base.id,
        style,
      })

      foundedCount += 1
    }

    if (!foundedCount) {
      result.pop()
    }
  }

  // Stack of theme collection type
  for (const themeName of themeKeys) {
    const theme = collections[themeName]
    const { groups } = theme

    result.push({
      type: "THEME_HEADER", 
      title: theme.name,
      theme: theme.name,
    })

    for (const groupName of keys(groups)) {
      const group = groups[groupName]

      result.push({
        type: "THEME_GROUP_HEADER",
        title: group.name,
        theme: theme.name,
        group: group.name,
      })

      if (!isOpened(`${themeName}:${groupName}`) && !hasSearchQuery) {
        continue
      }

      let foundedCount = 0
      for (const styleId of group.ids) {
        const style = theme.items[styleId]

        if (hasSearchQuery && !isContainSearch(style.base.name)) {
          continue
        }

        result.push({
          type: "STYLE_ITEM",
          theme: theme.name,
          group: group.name,
          id: styleId,
          style,
        })

        foundedCount += 1
      }

      if (!foundedCount) {
        result.pop()
      }
    }
  }

  return result
}

export const getOpenedGroups = (state: RootState) => state.themes.openedGroups
export const getSelections = (state: RootState) => state.themes.selections
export const getSearchQuery = (state: RootState) => state.themes.search

export const getPaintThemes = (state: RootState) => state.themes.paint
export const getTextThemes = (state: RootState) => state.themes.text

export const getFlatPaintThemes = createSelector(
  [getPaintThemes, getOpenedGroups, getSearchQuery],
  flatThemesMapReducer
)

export const getFlatTextThemes = createSelector(
  [getTextThemes, getOpenedGroups, getSearchQuery],
  flatThemesMapReducer
)

export const getFlatThemesList = createSelector(
  [getFlatPaintThemes, getFlatTextThemes],
  (paint, text) => ({
    paint,
    text,
  })
)
