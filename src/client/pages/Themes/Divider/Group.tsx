import { ListRowProps } from "react-virtualized"
import React from "react"

interface IProps {
  row: ListRowProps
}

export function Group({ row }: IProps) {
  return (
    <div key={row.key} style={row.style} className="header divider">
      <div className="title">Groups</div>
    </div>
  )
}
