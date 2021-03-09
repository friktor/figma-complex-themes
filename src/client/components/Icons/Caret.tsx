import get from "lodash-es/get"
import * as React from "react"

import { IconProps, defaultProps } from "./props"

export function Caret(props: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg" className="prefix__ionicon" viewBox="0 0 512 512"
            height={get(props, "size", defaultProps.size)}
            width={get(props, "size", defaultProps.size)}
        >
            <path
                stroke={get(props, "color", defaultProps.color)}
                d="M112 184l144 144 144-144"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="48"
                fill="none"
            />
        </svg>
    )
}
