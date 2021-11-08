import { useDispatch, useSelector } from "react-redux"
import { ListRowProps } from "react-virtualized"
import React, { useCallback } from "react"
import cx from "classnames"

import { Icons, Input, SelectPopup } from "client/components"
import { setGroupOpened } from "client/features/themes"
import { getSearchQuery } from "client/selectors"
import { RootState } from "client/features"

interface IProps {
  row: ListRowProps

  item: {
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

  const onChange = useCallback((params: { value: string }) => {
    // @TODO:
  }, [])

  const onCloneTheme = useCallback(() => {
    // @TODO:
  }, [])

  const onRemoveTheme = useCallback(() => {
    // @TODO:
  }, [])

  const onCreateDraftStyle = useCallback(() => {
    // @TODO:
  }, [])

  const onToggle = useCallback(() => dispatch(setGroupOpened({
    opened: !opened,
    group,
  })), [opened, group])

  return (
    <div key={row.key} style={row.style} className="group">
      <div className="name">
        <div className={cx("icon", { opened })} onClick={onToggle}>
          <Icons.Caret color="rgba(0,0,0, 0.5)" size={12} />
        </div>

        <Input
          validator={/^[a-zA-Z]+$/g}
          onChange={onChange}
          value={group}
          name="group"
        />
      </div>

      <div className="actions">
        <SelectPopup
          icon="MenuDots"
          iconSize={16}
          items={[{
            onClick: onCloneTheme,
            title: "Duplicate",
            icon: "Copy",
          }, {
            onClick: onRemoveTheme,
            title: "Remove",
            icon: "Trash",
          }]}
        />

        <div className="action" onClick={onCreateDraftStyle}>
          <Icons.Plus color="rgba(0,0,0, 0.8)" size={20} />
        </div>
      </div>
    </div>
  )
}
