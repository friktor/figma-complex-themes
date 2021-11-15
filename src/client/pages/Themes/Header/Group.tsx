import { useDispatch, useSelector } from "react-redux"
import { ListRowProps } from "react-virtualized"
import React, { useCallback } from "react"
import cx from "classnames"

import { Icons, Input, SelectPopup } from "client/components"
import { getSearchQuery } from "client/selectors"
import { RootState } from "client/features"

import {
  removeCollection,
  renameCollection,
  cloneCollection,
  setGroupOpened,
  createStyle,
} from "client/features/themes"

interface IProps {
  row: ListRowProps

  item: {
    styleType: "paint" | "text"
    type: "GROUP_HEADER"
    title: string
    group: string
  }
}

export function Group({ item, row }: IProps) {
  const searchQuery = useSelector(getSearchQuery)
  const dispatch = useDispatch()
  const { group } = item

  const opened = useSelector((state: RootState) => {
    const hasSearch = searchQuery && searchQuery.length > 0
    return state.themes.openedGroups[group] || hasSearch
  })

  const onChange = useCallback(
    (params: { value: string }) => {
      dispatch(
        renameCollection({
          type: item.styleType,
          new: params.value,
          old: item.group,
        }),
      )
    },
    [item],
  )

  const onCloneGroup = useCallback(() => {
    dispatch(
      cloneCollection({
        type: item.styleType,
        new: "UntitledGroup",
        old: item.group,
      }),
    )
  }, [item])

  const onRemoveGroup = useCallback(() => {
    dispatch(
      removeCollection({
        type: item.styleType,
        name: item.group,
      }),
    )
  }, [item])

  const onCreateStyle = useCallback(() => {
    dispatch(
      createStyle({
        styleType: item.styleType.toUpperCase() as any,
        name: "UntitledStyle",
        group: item.group,
      }),
    )
  }, [item])

  const onToggle = useCallback(
    () =>
      dispatch(
        setGroupOpened({
          opened: !opened,
          group,
        }),
      ),
    [opened, group],
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
              onClick: onCloneGroup,
              title: "Duplicate",
              icon: "Copy",
            },
            {
              onClick: onRemoveGroup,
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
