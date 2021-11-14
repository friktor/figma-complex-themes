import { configureStore } from "@reduxjs/toolkit"
import logger from "redux-logger"

import themesReducer from "./features/themes"

export const store = configureStore({
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
  reducer: {
    themes: themesReducer,
  },
})

export type AppDispatch = typeof store.dispatch
