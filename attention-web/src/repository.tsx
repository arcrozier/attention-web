import {UserInfo} from "./App";
import axios from "./axios";
import {AxiosResponse} from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.REACT_APP_BASE_URL

export const CSRF_COOKIE = 'csrftoken'

async function requireCSRF() {
    if (Cookies.get(CSRF_COOKIE) === undefined) await setCSRFToken()
    return
}

// authentication info: https://medium.com/swlh/django-rest-framework-and-spa-session-authentication-with-docker-and-nginx-aa64871f29cd
// https://www.django-rest-framework.org/api-guide/authentication/#sessionauthentication
export async function getUserInfo(): Promise<UserInfo> {
    await requireCSRF()
    return axios.get(`${BASE_URL}get_info/`)
}

export async function setCSRFToken(): Promise<AxiosResponse> {
    console.log('Getting CSRF Token')
    return axios.get(`${BASE_URL}set_csrf/`)
}

export async function login(username: string, password: string): Promise<any> {
    await requireCSRF()
    return axios.post(`${BASE_URL}login_session/`, {username: username, password: password})
}
