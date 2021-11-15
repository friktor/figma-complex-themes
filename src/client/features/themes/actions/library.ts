import { createAsyncThunk } from "@reduxjs/toolkit"
import * as api from "client/api"
import { Library } from "models"

export const getLibrary = createAsyncThunk<Library>("themes/getLibrary", async () => {
  const library = await api.getLibrary()
  return library
})
