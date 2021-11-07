export interface RedrawOptions {
  sourceFrameId: string // frame need to redraw
  targetThemeCollection: string // target theme name for entries styles

  redrawWithClone?: boolean // clone source frame & redraw it
  sourceThemeCollection?: string // source theme name
}

export interface ImportStylesOptions {
  sourceFrameIds: string[]
}

export interface SelectionEvent {
  type: string
  name: string
  id: string
}

export interface LibraryRenameOptions {
  oldname: string
  newname: string
}