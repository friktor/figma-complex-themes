import React, { ChangeEvent, KeyboardEvent, useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { createGroup, createTheme, createThemeGroup, setCreateFormOptions } from "client/features/themes"
import { getCreateFormOptions } from "client/selectors"
import objectSwitch from "utils/objectSwitch"
import { Icons } from "client/components"

export function CreateForm() {
  const options = useSelector(getCreateFormOptions)
  const [value, setValue] = useState("")
  const dispatch = useDispatch()

  const onClose = useCallback(() => {
    dispatch(setCreateFormOptions(undefined))
  }, [])

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }, [])

  const onSubmit = useCallback(() => {
    const action = objectSwitch(options.target, {
      theme_group: createThemeGroup({ theme: options.theme, group: value, type: options.type }),
      theme: createTheme({ theme: value, type: options.type }),
      group: createGroup({ group: value, type: options.type }),
    })

    dispatch(action)
    setValue("")
    onClose()
  }, [value])

  const onKeyPress = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        onSubmit()
      }
    },
    [onSubmit],
  )

  if (!options) {
    return null
  }

  const placeholder = objectSwitch(options.target, {
    theme_group: "Enter name for new theme group",
    theme: "Enter name for new theme",
    group: "Enter name for new group",
  })

  const inputProps = {
    autoFocus: true,
    name: "name",
    placeholder,
    onKeyPress,
    onChange,
    value,
  }

  return (
    <div className="create-form-modal">
      <div className="create-form-modal-overlay" onClick={onClose} />

      <div className="create-form">
        <div className="input">
          <input {...inputProps} />

          <div className="submit" onClick={onSubmit}>
            <Icons.Save size={20} color="#000" />
          </div>
        </div>
      </div>
    </div>
  )
}
