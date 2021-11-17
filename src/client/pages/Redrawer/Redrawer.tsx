import React, { useEffect, useState, useCallback } from "react"
import { useSelector } from "react-redux"
import * as Alert from "react-alert"

import { getAvailableThemes, getSelections } from "client/selectors"
import { Icons, SelectPopup } from "client/components"
import { SelectionItem } from "./SelectionItem"
import * as api from "client/api"

export function Redrawer(props) {
  const availableCollections = useSelector(getAvailableThemes)
  const currentSelections = useSelector(getSelections)
  const alert = Alert.useAlert()

  const [targetCollection, setTargetCollection] = useState<string>()

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

  const onRedrawAll = useCallback(async () => {
    const tasks = currentSelections.map(({ id }) =>
      api.redrawFrame({
        targetThemeCollection: targetCollection,
        sourceFrameId: id,
      }),
    )

    await Promise.all(tasks)
    ;(alert as any).success("Redraw all finished", {
      type: "success",
    })
  }, [])

  const selectionsByName = currentSelections.map(selection => selection.name).join(", ")

  const selections = currentSelections.map(selection => <SelectionItem selection={selection} key={selection.id} />)

  const collectionActions = availableCollections.map(name => ({
    onClick: onChangeCollection(name),
    title: name,
  }))

  if (!targetCollection) {
    return null
  }

  return (
    <div className="page redrawer">
      <div className="header">
        <div className="title">Selected</div>

        {selectionsByName.length > 0 && <div className="selections">{selectionsByName}</div>}
      </div>

      <div className="content">
        {selections.length > 0 ? (
          <div className="items">{selections}</div>
        ) : (
          <div className="empty">
            <div className="title">Please select layers for redraw</div>
          </div>
        )}
      </div>

      <div className="toolbar">
        <div className="name">Redraw all by</div>

        <div className="actions">
          <SelectPopup position="top center" title={targetCollection} items={collectionActions} />

          <div className="action" onClick={onRedrawAll}>
            <Icons.Brush size={16} />
          </div>
        </div>
      </div>
    </div>
  )
}
