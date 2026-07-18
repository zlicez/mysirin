import { createWrapper } from "next-redux-wrapper";
import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { teamAPI } from '../team/teamService'
import { newsAPI } from "../news/newsService";

import { contactsAPI } from "../contacts/contacts";
import { reviewsAPI } from "../reviews/reviews";
import { homeAPI } from "../home/home";

const rootReducer = combineReducers({
    [teamAPI.reducerPath]: teamAPI.reducer,
    [newsAPI.reducerPath]: newsAPI.reducer,
    [contactsAPI.reducerPath]: contactsAPI.reducer,
    [reviewsAPI.reducerPath]: reviewsAPI.reducer,
    [homeAPI.reducerPath]: homeAPI.reducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
            teamAPI.middleware, newsAPI.middleware, contactsAPI.middleware, reviewsAPI.middleware, homeAPI.middleware
        )
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']


export const wrapper = createWrapper<AppStore>(setupStore, {
    debug: process.env.NODE_ENV !== 'production'
});
