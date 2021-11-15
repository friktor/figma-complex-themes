import React from "react"

import { IconProps, defaultProps } from "./props"

export function Close(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="prefix__ionicon"
      viewBox="0 0 512 512"
      height={props?.size || defaultProps.size}
      width={props?.size || defaultProps.size}
    >
      <path
        strokeWidth="32"
        d="M368 368L144 144M368 144L144 368"
        stroke={props?.color || defaultProps.color}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
