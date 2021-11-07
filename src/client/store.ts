import { configureStore } from "@reduxjs/toolkit"
import logger from "redux-logger"

import themesReducer from "./features/themes"

export default configureStore({
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
  reducer: {
    themes: themesReducer,
  },
})
