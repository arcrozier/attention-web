import {UserInfo} from "../App";
import axios from "./axios";
import {AxiosResponse} from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.REACT_APP_BASE_URL

export interface APIResult<T> {
    success: boolean,
    message: string,
    data: T | null
}

export const CSRF_COOKIE = 'csrftoken'

async function requireCSRF() {
    if (Cookies.get(CSRF_COOKIE) === undefined) await setCSRFToken()
    return
}

// authentication info: https://medium.com/swlh/django-rest-framework-and-spa-session-authentication-with-docker-and-nginx-aa64871f29cd
// https://www.django-rest-framework.org/api-guide/authentication/#sessionauthentication
export async function getUserInfo(): Promise<AxiosResponse<APIResult<UserInfo>>> {
    await requireCSRF()
    return axios.get(`${BASE_URL}get_info/`)
}

export async function setCSRFToken(): Promise<AxiosResponse> {
    console.log('Getting CSRF Token')
    return axios.get(`${BASE_URL}set_csrf/`)
}

export async function login(username: string, password: string): Promise<AxiosResponse> {
    await requireCSRF()
    return axios.post(`${BASE_URL}login/`, {username: username, password: password})
}

export async function createAccount(username: string, email: string | null, firstName: string, lastName: string, password: string, tosAgree: boolean): Promise<AxiosResponse<APIResult<null>>> {
    await requireCSRF()
    return axios.post(`${BASE_URL}register_user/`, {
        username: username,
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
        tos_agree: tosAgree ? "yes" : "no"
    })
}
