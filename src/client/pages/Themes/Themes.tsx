import { AutoSizer, List, ListRowProps, Size } from "react-virtualized"
import React, { useCallback, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { createGroup, createTheme } from "client/features/themes"
import { getFlatThemesList, getSelections } from "client/selectors"
import { SelectPopup } from "client/components"
import objectSwitch from "utils/objectSwitch"
import * as Divider from "./Divider"
import * as Header from "./Header"
import { Search } from "./Search"
import { Item } from "./Item"
interface IProps {}

export function Themes(props: IProps) {
  const [themeType, setThemeType] = useState<"paint" | "text">("paint")
  const themes = useSelector(getFlatThemesList)
  const selections = useSelector(getSelections)
  const dispatch = useDispatch()
  const list = themes[themeType]
  const listRef = useRef()

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
    [themes],
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
    [themes],
  )

  const onCreateTempGroup = React.useCallback(() => {
    dispatch(createGroup({ group: "Untitled", type: themeType }))
  }, [themeType])

  const onCreateTempTheme = React.useCallback(() => {
    dispatch(createTheme({ theme: "Untitled", type: themeType }))
  }, [])

  const onImportStyles = React.useCallback(() => {
    // @TODO
  }, [])

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
  ]

  const listProps = {
    rowRenderer: rowRenderer,
    rowHeight: getRowHeight,
    rowCount: list.length,
    overscanRowCount: 10,
    className: "list",
    ref: listRef,
  }

  const actionsProps = {
    iconColor: "#18a0fb",
    items: actions,
    iconSize: 20,
    icon: "Plus",
  }

  const listCalculator = (size: Size): React.ReactNode => (
    <List
      // height={size.height}
      width={size.width}
      height={520}
      {...listProps}
    />
  )

  return (
    <div className="page themes">
      <div className="header">
        <Search />

        <div className="actions">
          <SelectPopup {...actionsProps} />
        </div>
      </div>

      <AutoSizer children={listCalculator} />
    </div>
  )
}
