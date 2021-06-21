import React, {FC, useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {IUser} from "./models/IUser";
import UserService from "./services/UserService";

const App: FC = () => {
    const {store} = useContext(Context)
    const [users, setUsers] = useState<IUser[]>([])

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [store])

    if (store.isLoading) {
        return <h1>Загрузка...</h1>
    }

    if (!store.isAuth) {
        return (
            <LoginForm/>
        )
    }

    async function getUsers() {
        try {
            const res = await UserService.fetchUsers()
            setUsers(res.data)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div>
            <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : "Пользователь не авторизован"}</h1>
            <h1>{store.user.isActivated ? 'Аккаунт активирован' : "Аккаунт не активирован!"}</h1>
            <button onClick={() => store.logout()}>Выйти</button>
            <button onClick={getUsers}>Показать всех пользователей</button>
            {users.map(user => (
                <div key={user.email}>{user.email}</div>
            ))}
        </div>
    )
}

export default observer(App);
