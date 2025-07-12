import {fetchBaseQuery, createApi} from '@reduxjs/toolkit/query/react'
import {BASE_URL} from '../constants'

const baseQuery=fetchBaseQuery({ baseurl: BASE_URL});

export const apiSlice = createApi({
    baseQuery,
    endpoints: () =>({}),
});