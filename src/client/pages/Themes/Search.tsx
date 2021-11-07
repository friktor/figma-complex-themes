import React, { ChangeEvent, KeyboardEventHandler, useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { setSearchQuery } from "client/features/themes"
import { getSearchQuery } from "client/selectors"
import { Icons } from "client/components"

export function Search() {
  const [value, setValue] = useState("")
  const searchQuery = useSelector(getSearchQuery)
  const dispatch = useDispatch()

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value), [])
  const onBlur = useCallback(() => dispatch(setSearchQuery(value)), [value])

  const onClear = useCallback(() => {
    dispatch(setSearchQuery(undefined))
    setValue("")
  }, [])

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback((event) => {
    if (event.key === "Enter") {
      dispatch(setSearchQuery(value))
    }
  }, [value])

  return (
    <div className="search">
      <Icons.Search size={16} />

      <input
        placeholder="Search Style"
        onKeyDown={onKeyDown}
        onChange={onChange}
        onBlur={onBlur}
        value={searchQuery}
        type="text"
      />

      {searchQuery && (
        <div className="clear" onClick={onClear}>
          <Icons.Close size={18} />
        </div>
      )}
    </div>
  )
}
