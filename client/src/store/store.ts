import {IUser} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";

export default class Store {
    user = {} as IUser
    isAuth = false
    isLoading = false

    constructor() {
        makeAutoObservable(this)
    }

    setAuth(bool: boolean) {
        this.isAuth = bool
    }

    setUser(user: IUser) {
        this.user = user
    }

    setLoading(bool: boolean) {
        this.isLoading = bool
    }

    async login(email: string, password: string) {
        try {
            const res = await AuthService.login(email, password)
            console.log(res)
            localStorage.setItem('token', res.data.accessToken)
            this.setAuth(true)
            this.setUser(res.data.user)
        } catch (e) {
            console.log(e.res?.data?.message)
        }
    }

    async registration(email: string, password: string) {
        try {
            const res = await AuthService.registration(email, password)
            console.log(res)
            localStorage.setItem('token', res.data.accessToken)
            this.setAuth(true)
            this.setUser(res.data.user)
        } catch (e) {
            console.log(e.res?.data?.message)
        }
    }

    async logout() {
        try {
            const res = await AuthService.logout()
            console.log(res)
            localStorage.removeItem('token')
            this.setAuth(false)
            this.setUser({} as IUser)
        } catch (e) {
            console.log(e.res?.data?.message)
        }
    }

    async checkAuth() {
        this.setLoading(true)
        try {
            const res = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})

            localStorage.setItem('token', res.data.accessToken)
            this.setAuth(true)
            this.setUser(res.data.user)
        } catch (e) {
            console.log(e.res?.data?.message)
        } finally {
            this.setLoading(false)
        }
    }
}