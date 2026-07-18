import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { HYDRATE } from "next-redux-wrapper";
import { apiBaseUrl } from "../apiBaseUrl";

interface fetchVideoProps {
    url_video?: string,
}

export const homeAPI = createApi({
    reducerPath: 'homeApi',
    baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath]
        }
    },
    endpoints: (build) => ({
        fetchHomeVideo: build.query({
            query: () => {
                return ({
                    url: `home`,
                })
            }
        }),
        fetchHomeSlides: build.query({
            query: () => ({ url: 'home-slides' })
        }),
    })
})

export const { fetchHomeVideo, fetchHomeSlides } = homeAPI.endpoints
