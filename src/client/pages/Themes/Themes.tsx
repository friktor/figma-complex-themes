import React, { useCallback, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { List, ListRowProps } from "react-virtualized"

import { getFlatPaintThemes, getFlatTextThemes, getSelections } from "client/selectors"
import { getThemes, setCreateFormOptions } from "client/features/themes"
import { SelectPopup } from "client/components"
import objectSwitch from "utils/objectSwitch"
import * as Divider from "./Divider"
import * as Header from "./Header"
import { StyleType } from "models"
import * as api from "client/api"
import { Search } from "./Search"
import { Item } from "./Item"

export function Themes() {
  const [themeType, setThemeType] = useState<StyleType>(StyleType.PAINT)
  const selections = useSelector(getSelections)
  const dispatch = useDispatch()
  const listRef = useRef()

  const list = useSelector(
    objectSwitch(themeType, {
      [StyleType.PAINT]: getFlatPaintThemes,
      [StyleType.TEXT]: getFlatTextThemes,
    }),
  )

  const getRowHeight = useCallback(
    ({ index }: ListRowProps) =>
      objectSwitch(list[index].type, {
        THEME_GROUP_HEADER: 36,
        GROUP_HEADER: 36,
        THEME_HEADER: 36,

        THEMES_DIVIDER: 36,
        GROUPS_DIVIDER: 36,

        STYLE_ITEM: 34,
      }),
    [list],
  )

  const rowRenderer = useCallback(
    (rowProps: ListRowProps) => {
      const item = list[rowProps.index]

      return objectSwitch(
        item.type,
        {
          THEME_GROUP_HEADER: () => <Header.ThemeGroup item={item} row={rowProps} />,
          THEME_HEADER: () => <Header.Theme item={item} row={rowProps} />,
          GROUP_HEADER: () => <Header.Group item={item} row={rowProps} />,

          THEMES_DIVIDER: () => <Divider.Theme row={rowProps} />,
          GROUPS_DIVIDER: () => <Divider.Group row={rowProps} />,

          STYLE_ITEM: () => <Item item={item} row={rowProps} />,
        },
        true,
      )
    },
    [list],
  )

  const onCreateTempGroup = useCallback(() => {
    dispatch(setCreateFormOptions({ type: themeType, target: "group" } as any))
  }, [themeType])

  const onCreateTempTheme = useCallback(() => {
    dispatch(setCreateFormOptions({ type: themeType, target: "theme" } as any))
  }, [])

  const onImportStyles = useCallback(async () => {
    const sourceFrameIds = selections.map(({ id }) => id)
    await api.importStyleFromFrameToTheme({ sourceFrameIds })
    dispatch(getThemes())
  }, [selections])

  const onChangeThemeType = useCallback(
    (key: StyleType) => () => {
      setThemeType(key)
    },
    [],
  )

  let importStylesTitle
  if (selections?.length > 0) {
    importStylesTitle = (
      <>
        Import Styles
        <span style={{ opacity: 0.8, fontSize: 9, marginLeft: 2 }}>
          (From {selections.map(({ name }) => name).join(", ")})
        </span>
      </>
    )
  } else {
    importStylesTitle = (
      <>
        Import Styles
        <span style={{ opacity: 0.8, fontSize: 9, marginLeft: 2 }}>(Please select frames)</span>
      </>
    )
  }

  const actions = [
    {
      className: "action theme-type",
      iconColor: "#000",
      iconSize: 12,

      icon: objectSwitch(themeType, {
        [StyleType.PAINT]: "Brush",
        [StyleType.TEXT]: "Text",
      }),

      items: [StyleType.PAINT, StyleType.TEXT].map((key: StyleType) => ({
        onClick: onChangeThemeType(key),
        title: `Show ${key.toLowerCase()} themes`,
        icon: objectSwitch(key, {
          [StyleType.PAINT]: "Brush",
          [StyleType.TEXT]: "Text",
        }),
      })),
    },
    {
      iconColor: "#18a0fb",
      iconSize: 20,
      icon: "Plus",
      items: [
        {
          onClick: onCreateTempGroup,
          title: "Create Group",
        },
        {
          onClick: onCreateTempTheme,
          title: "Create Theme",
        },
        {
          onClick: onImportStyles,
          title: importStylesTitle,
        },
      ],
    },
  ]

  return (
    <div className="page themes">
      <div className="header">
        <Search />

        <div className="actions">
          {actions.map((actionProps, index) => (
            <SelectPopup key={`menu-${index}`} {...actionProps} />
          ))}
        </div>
      </div>

      {list.length > 0 ? (
        <List
          rowRenderer={rowRenderer}
          rowHeight={getRowHeight}
          rowCount={list.length}
          overscanRowCount={10}
          className={"list"}
          ref={listRef}
          height={528}
          width={340}
        />
      ) : (
        <div className="empty">
          <div className="title">Style collections is empty</div>
        </div>
      )}
    </div>
  )
}
