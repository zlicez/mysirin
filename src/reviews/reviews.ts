import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'
import { apiBaseUrl } from '../apiBaseUrl'

export const reviewsAPI = createApi({
    reducerPath: 'reviewsAPI',
    baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath]
        }
    },
    endpoints: (build) => ({
        getReviews: build.query({
            query: () => ({
                url: 'reviews',
            })
        })
    }),
})

export const { getReviews } = reviewsAPI.endpoints
