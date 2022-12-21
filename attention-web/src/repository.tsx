import {UserInfo} from "./App";
import axios from "./axios";

const BASE_URL = process.env.BASE_URL

// authentication info: https://medium.com/swlh/django-rest-framework-and-spa-session-authentication-with-docker-and-nginx-aa64871f29cd
// https://www.django-rest-framework.org/api-guide/authentication/#sessionauthentication
export async function getUserInfo(): Promise<UserInfo> {
    return axios.get(`${BASE_URL}/get_info/`)
}

export async function setCSRFToken(): Promise<any> {
    return axios.get(`${BASE_URL}/set_csrf/`)
}
