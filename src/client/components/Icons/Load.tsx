import get from "lodash-es/get"
import * as React from "react"

import { IconProps, defaultProps } from "./props"

export function Load(props: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg" className="prefix__ionicon" viewBox="0 0 512 512"
            height={get(props, "size", defaultProps.size)}
            width={get(props, "size", defaultProps.size)}
        >
            <path
                d="M336 176h40a40 40 0 0140 40v208a40 40 0 01-40 40H136a40 40 0 01-40-40V216a40 40 0 0140-40h40"
                fill="none"
                stroke={get(props, "color", defaultProps.color)}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={32}
            />
            <path
                fill="none"
                stroke={get(props, "color", defaultProps.color)}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={32}
                d="M176 272l80 80 80-80M256 48v288"
            />
        </svg>
    )
}
