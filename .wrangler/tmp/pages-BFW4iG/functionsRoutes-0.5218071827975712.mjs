import { onRequestPost as __api_ask_ts_onRequestPost } from "C:\\Users\\Compaq\\Documents\\GitHub\\5025Wiki\\functions\\api\\ask.ts"
import { onRequest as __api_ask_ts_onRequest } from "C:\\Users\\Compaq\\Documents\\GitHub\\5025Wiki\\functions\\api\\ask.ts"

export const routes = [
    {
      routePath: "/api/ask",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_ask_ts_onRequestPost],
    },
  {
      routePath: "/api/ask",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_ask_ts_onRequest],
    },
  ]