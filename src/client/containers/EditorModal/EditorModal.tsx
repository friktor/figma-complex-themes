import { observer } from "mobx-react"
import Modal from "react-modal"
import * as React from "react"
import { toJS } from "mobx"

import { StyleEditor } from "client/components"
import { Style, useThemes } from "client/store"
import { RawStyle } from "models"

interface IProps {
    opened: boolean,
    style?: Style,
}

Modal.setAppElement("#root")

export const ModalEditor = observer(function ModalEditor(props: IProps) {
    const [ rawStyle, setRawStyle ] = React.useState<undefined | RawStyle>()
    const themeStore = useThemes()
    
    const availableCollections = []; for (const [ _id, collection ] of themeStore.themes.entries()) {
        availableCollections.push(collection.name)
    }

    React.useEffect(() => {
        if (props.style) {
            const _raw = {
                inner: toJS(props.style.inner),
                base: toJS(props.style.base),
            }

            setRawStyle(_raw)
        } else {
            setRawStyle(undefined)
        }
    }, [ props.opened ])

    const onModalClose = React.useCallback(() => {
        themeStore.toggleModal()
    }, [ props.opened ])

    const onChangeCollection = React.useCallback((name: string) => {
        props.style.moveToCollection(name)
    }, [ props.style ])

    const onChangeEditorName = React.useCallback((params: {
        name: "style" | "group",
        value: string,
    }) => {
        if (params.name === "style") {
            props.style.renameStyle(params.value)
        } else {
            props.style.moveToGroup(params.value)
        }
    }, [ props.style ])

    const onReplacePaints = React.useCallback((paints: Paint[]) => {
        props.style.replacePaints(paints)
    }, [ props.style ])

    const modalProps = {
        onRequestClose: onModalClose,
        isOpen: props.opened,

        style: {
            overlay: {
                zIndex: "998",
            },

            content : {
                borderRadius: "none",
                border: "none",
                padding: "0px",
                height: "100%",
                width: "100%",
                bottom: "0px",
                right: "0px",
                left: "0px",
                top: "0px",
            }
        },
    }

    const editorProps = {
        availableCollections,
        style: rawStyle,

        onChangeName: onChangeEditorName,
        onClose: onModalClose,
        onChangeCollection,
        onReplacePaints,
    }

    return (
        <Modal {...modalProps}>
            {rawStyle && (
                <StyleEditor {...editorProps} />
            )}
        </Modal>
    )
})
