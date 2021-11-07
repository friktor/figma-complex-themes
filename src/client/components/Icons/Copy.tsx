import React from "react"

import { IconProps, defaultProps } from "./props"

export function Copy(props: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg" className="prefix__ionicon" viewBox="0 0 512 512"
            height={props?.size || defaultProps.size}
            width={props?.size || defaultProps.size}
        >
            <path fill={props?.color || defaultProps.color} d="M408 480H184a72 72 0 01-72-72V184a72 72 0 0172-72h224a72 72 0 0172 72v224a72 72 0 01-72 72z" />
            <path fill={props?.color || defaultProps.color} d="M160 80h235.88A72.12 72.12 0 00328 32H104a72 72 0 00-72 72v224a72.12 72.12 0 0048 67.88V160a80 80 0 0180-80z" />
        </svg>
    )
}
