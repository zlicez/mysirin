import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react"
import { HYDRATE } from "next-redux-wrapper"
import { ITeam } from '../models/ITeam'
import { apiBaseUrl } from '../apiBaseUrl'

export const teamAPI = createApi({
    reducerPath: 'teamApi',
    baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath]
        }
    },
    endpoints: (build) => ({
        fetchAllTeam: build.query<ITeam[], number>({
            query: () => ({
                url: 'crew',
            })
        }),
        fetchCurrentTeam: build.query({
            query: (id: number) => ({
                url: `crew/${id}`
            })
        })
    })
})

export const { fetchAllTeam, fetchCurrentTeam } = teamAPI.endpoints
