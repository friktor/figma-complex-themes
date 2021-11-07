import React from "react"

import { IconProps, defaultProps } from "./props"

export function Search(props: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg" className="prefix__ionicon" viewBox="0 0 512 512"
            height={props?.size || defaultProps.size}
            width={props?.size || defaultProps.size}
        >
            <path
                d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
                stroke={props?.color || defaultProps.color}
                strokeMiterlimit={10}
                strokeWidth={32}
                fill="none"
            />
            <path
                stroke={props?.color || defaultProps.color}
                d="M338.29 338.29L448 448"
                strokeLinecap="round"
                strokeMiterlimit={10}
                strokeWidth={32}
                fill="none"
            />
        </svg>
    )
}
