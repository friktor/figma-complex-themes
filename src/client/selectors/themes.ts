import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "client/features"
const { keys } = Object 

export const flatThemesMapReducer = (
  themes: any,
  openedGroups: Record<string, boolean>,
  searchQuery?: string,
) => {
  const hasSearchQuery = searchQuery && searchQuery.length > 1
  const isContainSearch = (name) => name.includes(searchQuery)
  const isOpened = (key) => openedGroups[key]
  const result = []

  for (const themeName of keys(themes)) {
    const theme = themes[themeName]
    const { groups } = theme

    result.push({
      type: "THEME_HEADER", 
      title: theme.name,
      theme: theme.name,
    })

    for (const groupName of keys(groups)) {
      const group = groups[groupName]

      result.push({
        type: "GROUP_HEADER",
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
