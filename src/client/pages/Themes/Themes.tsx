import { AutoSizer, List, ListRowProps } from "react-virtualized"
import React, { useCallback, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { getFlatThemesList, getSelections } from "client/selectors"
import { SelectPopup } from "client/components"
import objectSwitch from "utils/objectSwitch"
import { Search } from "./Search"
import { Theme } from "./Theme"
import { Group } from "./Group"
import { Item } from "./Item"
interface IProps { }

export function Themes(props: IProps) {
  const [themeType, setThemeType] = useState<"paint" | "text">("paint")
  const themes = useSelector(getFlatThemesList)
  const selections = useSelector(getSelections)
  const dispatch = useDispatch()
  const list = themes[themeType]
  const listRef = useRef()

  const getRowHeight = useCallback(({ index }: ListRowProps) => objectSwitch(list[index].type, {
    THEME_HEADER: 40,
    GROUP_HEADER: 40,
    STYLE_ITEM: 36,
  }), [themes])

  const rowRenderer = useCallback((rowProps: ListRowProps) => {
    const item = list[rowProps.index]

    return objectSwitch(item.type, {
      THEME_HEADER: () => <Theme item={item} row={rowProps} />,
      GROUP_HEADER: () => <Group item={item} row={rowProps} />,
      STYLE_ITEM: () => <Item item={item} row={rowProps} />,
    }, true)
  }, [themes])

  const onCreateTempGroup = React.useCallback(() => {
    // @TPDP:
  }, [])

  const onCreateTempCollection = React.useCallback(() => {
    // @TPDP:
  }, [])

  const onImportStyles = React.useCallback(() => {
    // @TPDP:
  }, [])

  let importStylesTitle
  if (selections?.length > 0) {
    importStylesTitle = (
      <>
        Import Styles
        <span style={{ opacity: 0.8, fontSize: 9, marginLeft: 2 }}>
          (From {selections.map(({name}) => name).join(", ")})
        </span>
      </>
    )
  } else {
    importStylesTitle = (
      <>
        Import Styles
        <span style={{ opacity: 0.8, fontSize: 9, marginLeft: 2 }}>
          (Please select frames)
        </span>
      </>
    )
  }

  const actions = [{
    onClick: onCreateTempGroup,
    title: "Create Group",
  }, {
    onClick: onCreateTempCollection,
    title: "Create Collection",
  }, {
    onClick: onImportStyles,
    title: importStylesTitle,
  }]

  return (
    <div className="page themes">
      <div className="header">
        <Search />

        <div className="actions">
          <SelectPopup
            iconColor="#18a0fb"
            items={actions}
            iconSize={20}
            icon="Plus"
          />
        </div>
      </div>

      <AutoSizer>
        {({ width, height }) => (
          <List
            overscanRowCount={10}
            className="list"
            height={height}
            width={width}
            ref={listRef}

            rowCount={list.length}
            rowRenderer={rowRenderer}
            rowHeight={getRowHeight}
          />
        )}
      </AutoSizer>
    </div>
  )
}
