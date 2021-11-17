import { RawStyle } from "models"
import { last } from "utils/helpers"
const { keys } = Object

interface FlatReducerParams {
  openedGroups: Record<string, boolean>
  styleType: "paint" | "text"
  collections: any

  searchQuery?: string
}

export const flatThemesMapReducer = (options: FlatReducerParams) => {
  const { searchQuery, collections, openedGroups, styleType } = options

  const hasSearchQuery = searchQuery && searchQuery.length > 1
  const isContainSearch = name => name.includes(searchQuery)
  const isOpened = key => openedGroups[key]
  const stackList = []

  const themeKeys = []
  const groupKeys = []

  for (const collectionName of keys(collections).sort()) {
    const collection = collections[collectionName]

    if (collection.type === "theme") {
      themeKeys.push(collectionName)
    } else {
      groupKeys.push(collectionName)
    }
  }

  // Stack for group collection type
  stackList.push({ type: "GROUPS_DIVIDER" })

  for (const groupName of groupKeys) {
    const group = collections[groupName]

    stackList.push({
      type: "GROUP_HEADER",
      title: group.name,
      group: group.name,
      styleType,
    })

    if (!isOpened(group.name) && !hasSearchQuery) {
      continue
    }

    let countStyles = 0
    for (const style of Object.values<RawStyle>(group.items)) {
      if (hasSearchQuery && !isContainSearch(style.base.name)) {
        continue
      }

      stackList.push({
        type: "STYLE_ITEM",
        group: group.name,
        id: style.base.id,
        styleType,
        style,
      })

      countStyles += 1
    }

    if (!countStyles && hasSearchQuery) {
      stackList.pop()
    }
  }

  if (last(stackList).type === "GROUPS_DIVIDER") {
    stackList.pop()
  }

  // Stack of theme collection type
  stackList.push({ type: "THEMES_DIVIDER" })

  for (const themeName of themeKeys) {
    const theme = collections[themeName]
    const { groups } = theme

    stackList.push({
      type: "THEME_HEADER",
      title: theme.name,
      theme: theme.name,
      styleType,
    })

    for (const groupName of keys(groups).sort()) {
      const group = groups[groupName]

      stackList.push({
        type: "THEME_GROUP_HEADER",
        title: group.name,
        theme: theme.name,
        group: group.name,
        styleType,
      })

      if (!isOpened(`${themeName}:${groupName}`) && !hasSearchQuery) {
        continue
      }

      for (const styleId of group.ids) {
        const style = theme.items[styleId]

        if (hasSearchQuery && !isContainSearch(style.base.name)) {
          continue
        }

        stackList.push({
          type: "STYLE_ITEM",
          theme: theme.name,
          group: group.name,
          id: styleId,
          styleType,
          style,
        })
      }

      if (last(stackList).type === "THEME_GROUP_HEADER" && hasSearchQuery) {
        stackList.pop()
      }
    }
  }

  if (last(stackList).type === "THEMES_DIVIDER") {
    stackList.pop()
  }

  return stackList
}
