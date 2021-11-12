import { useDispatch, useSelector } from "react-redux"
import { ListRowProps } from "react-virtualized"
import React, { useCallback } from "react"
import cx from "classnames"

import { Icons, Input, SelectPopup } from "client/components"
import { getSearchQuery } from "client/selectors"
import { RootState } from "client/features"

import {
  renameThemeGroup,
  removeThemeGroup,
  cloneThemeGroup,
  setGroupOpened,
  createStyle,
} from "client/features/themes"

interface IProps {
  row: ListRowProps

  item: {
    styleType: "paint" | "text"
    type: "THEME_GROUP_HEADER"
    title: string

    theme: string
    group: string
  }
}

export function ThemeGroup({ item, row }: IProps) {
  const searchQuery = useSelector(getSearchQuery)
  const dispatch = useDispatch()
  const { theme, group } = item

  const opened = useSelector((state: RootState) => {
    const hasSearch = searchQuery && searchQuery.length > 0
    const key = `${theme}:${group}`

    return state.themes.openedGroups[key] || hasSearch
  })

  const onChange = useCallback(
    (params: { value: string }) => {
      dispatch(
        renameThemeGroup({
          type: item.styleType,
          theme: item.theme,
          group: item.group,
          new: params.value,
        }),
      )
    },
    [item],
  )

  const onCloneThemeGroup = useCallback(() => {
    dispatch(
      cloneThemeGroup({
        type: item.styleType,
        theme: item.theme,
        group: item.group,

        new: "UntitledGroup",
      }),
    )
  }, [item])

  const onRemoveThemeGroup = useCallback(() => {
    dispatch(
      removeThemeGroup({
        type: item.styleType,
        theme: item.theme,
        group: item.group,
      }),
    )
  }, [item])

  const onCreateStyle = useCallback(() => {
    dispatch(
      createStyle({
        styleType: item.styleType.toUpperCase() as any,
        theme: item.theme,
        group: item.group,
        name: "Untitled",
      }),
    )
  }, [])

  const onToggle = useCallback(
    () =>
      dispatch(
        setGroupOpened({
          opened: !opened,
          theme,
          group,
        }),
      ),
    [opened, theme, group],
  )

  return (
    <div key={row.key} style={row.style} className="header group">
      <div className="name">
        <div className={cx("icon", { opened })} onClick={onToggle}>
          <Icons.Caret color="rgba(0,0,0, 0.5)" size={12} />
        </div>

        <Input validator={/^[a-zA-Z]+$/g} onChange={onChange} value={group} name="group" />
      </div>

      <div className="actions">
        <SelectPopup
          icon="MenuDots"
          iconSize={16}
          items={[
            {
              onClick: onCloneThemeGroup,
              title: "Duplicate",
              icon: "Copy",
            },
            {
              onClick: onRemoveThemeGroup,
              title: "Remove",
              icon: "Trash",
            },
          ]}
        />

        <div className="action" onClick={onCreateStyle}>
          <Icons.Plus color="rgba(0,0,0, 0.8)" size={20} />
        </div>
      </div>
    </div>
  )
}
