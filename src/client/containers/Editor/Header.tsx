import React, { useCallback } from "react"
import { useDispatch } from "react-redux"

import { Input, PaintPreview, TextPreview } from "client/components"
import { renameStyle, setEditableStyle } from "client/features/themes"
import objectSwitch from "utils/objectSwitch"
import { RawStyle, StyleType } from "models"
import { AppDispatch } from "client/store"

interface IProps {
  style: RawStyle
}

export function Header({ style }: IProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { inner } = style as any
  const { base: item } = style

  const onChange = useCallback(
    (type: "group" | "name") => async (params: { value: string }) => {
      const names = objectSwitch(type, {
        group: { group: params.value, name: item.name },
        name: { name: params.value },
      })

      try {
        const {
          styles: [updated],
        } = await dispatch(
          renameStyle({
            collection: item.theme ? item.theme : item.group,
            type: inner.type.toLowerCase(),
            id: item.id,
            names,
          }),
        ).unwrap()

        dispatch(setEditableStyle(updated))
      } catch (error) {
        console.error(error)
      }
    },
    [item],
  )

  const onChangeName = useCallback(onChange("name"), [onChange])
  const onChangeGroup = useCallback(onChange("group"), [onChange])

  const preview = objectSwitch(inner.type, {
    [StyleType.PAINT]: <PaintPreview paints={inner.properties.paints} />,
    [StyleType.TEXT]: <TextPreview />,
  })

  return (
    <div className="header">
      {preview}

      <div className="names">
        <div className="name">
          <Input value={style.base.group} validator={/^[a-zA-Z]+$/g} onChange={onChangeGroup} name="style" />
        </div>

        <div className="divider">/</div>

        <div className="name">
          <Input value={style.base.name} validator={/^[a-zA-Z]+$/g} onChange={onChangeName} name="style" />
        </div>
      </div>
    </div>
  )
}
