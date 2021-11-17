import { configureStore } from "@reduxjs/toolkit"
import logger from "redux-logger"

import themesReducer from "./features/themes"

export const store = configureStore({
  reducer: {
    themes: themesReducer,
  },
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware()
    
    if (process.env.NODE_ENV !== "production") {
      middlewares.push(logger)
    }

    return middlewares
  },
})

export type AppDispatch = typeof store.dispatch
