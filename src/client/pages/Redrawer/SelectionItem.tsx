import React, { useState, useEffect, useCallback } from "react"
import { useSelector } from "react-redux"
import * as Alert from "react-alert"

import { Icons, SelectPopup } from "client/components"
import { getAvailableThemes } from "client/selectors"
import { SelectionEvent } from "models"
import * as api from "client/api"

interface SelectionItemProps {
  selection: SelectionEvent
}

export function SelectionItem({ selection }: SelectionItemProps) {
  const [targetCollection, setTargetCollection] = useState<string>()
  const availableCollections = useSelector(getAvailableThemes)
  const alert = Alert.useAlert()

  useEffect(() => {
    if (availableCollections.length) {
      setTargetCollection(availableCollections[0])
    }
  }, [availableCollections])

  const onChangeCollection = useCallback(
    (name: string) => () => {
      setTargetCollection(name)
    },
    [],
  )

  const onRedraw = useCallback(async () => {
    await api.redrawFrame({
      targetThemeCollection: targetCollection,
      sourceFrameId: selection.id,
    })

    alert.success("Redraw finished", {
      type: "success",
    })
  }, [targetCollection, selection])

  const actions = availableCollections.map(name => ({
    onClick: onChangeCollection(name),
    title: name,
  }))

  if (!targetCollection) {
    return null
  }

  return (
    <div className="item selection">
      <div className="name">{selection.name}</div>

      <div className="actions">
        <SelectPopup title={targetCollection} items={actions} />

        <div className="action" onClick={onRedraw}>
          <Icons.Brush size={16} />
        </div>
      </div>
    </div>
  )
}
