
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as bases from "../components/bases";
import * as utils from "../components/utils";
import * as constants from "../components/constants";
import * as components from "../components/components";
import * as loaders from "../components/loaders";

export default function Page() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userRegister = useSelector((state: any) => state.userRegister);
    const [form, setForm] = useState({
        username: "",
        surname:"",
        name:"",
        weight: 0,
        height:0,
        password: "",
        password2: "",
    });

    function sendForm(event: any) {

        event.preventDefault();

        if (form.password === form.password2 && !userRegister.load) {
        components.constructorWebAction(
            dispatch,
            constants.userRegister,
            `${constants.host}/api/register`,
            "POST",
            {},
            { username: form.username, password: form.password,password2: form.password2 , surname : form.surname,name: form.name,weight: form.weight,height: form.height},
            10000,
            true,
        );
        } else {
        window.alert("Заполните пароль!");
        }
    }


    useEffect(() => {
        if (userRegister && userRegister.data) {
        utils.LocalStorage.set("username", form.username);
        setTimeout(() => {
            navigate("/");
            dispatch({ type: constants.userRegister.reset });
        }, 2000);
        }
    }, [userRegister]);

    useEffect(() => {
        if (constants.isDebug) {
        console.log("userRegister: ", userRegister);
        }
    }, [userRegister]);

    return (
            <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-20">
            <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-slate-50">
                Введите данные для регистрации
            </h2>
        
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="" onSubmit={sendForm}>
                <div>
                    <label
                    htmlFor="email"
                    className="block text-sm font-semibold leading-6 text-slate-50"
                    >
                    Логин:
                    </label>
                    <div className="mt-2">
                    <input
                        onChange={(event) =>
                        setForm({ ...form, username: event.target.value })
                        }
                        placeholder="Email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                    />
                    </div>
                </div>
                <div>
                    <label
                    htmlFor="text"
                    className="block text-sm font-semibold leading-6 text-slate-50"
                    >
                    Имя:
                    </label>
                    <div className="mt-2">
                    <input
                        onChange={(event) =>
                        setForm({ ...form, name: event.target.value })
                        }
                        placeholder="Иван"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                    />
                    </div>
                </div>
                <div>
                    <label
                    htmlFor="text"
                    className="block text-sm font-semibold leading-6 text-slate-50"
                    >
                    Фамилия:
                    </label>
                    <div className="mt-2">
                    <input
                        onChange={(event) =>
                        setForm({ ...form, surname: event.target.value })
                        }
                        placeholder="Иванов"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                    />
                    </div>
                </div>
                <div>
                    <label
                    htmlFor="number"
                    className="block text-sm font-semibold leading-6 text-slate-50"
                    >
                    Вес:
                    </label>
                    <div className="mt-2">
                    <input
                        onChange={(event) =>
                        setForm({ ...form, weight: Number(event.target.value) })
                        }
                        placeholder="80"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                    />
                    </div>
                </div>
                <div>
                    <label
                    htmlFor="number"
                    className="block text-sm font-semibold leading-6 text-slate-50"
                    >
                    Рост:
                    </label>
                    <div className="mt-2">
                    <input
                        onChange={(event) =>
                        setForm({ ...form, height: Number(event.target.value) })
                        }
                        placeholder="180"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                    />
                    </div>
                </div>
        
                <div>
                    <label
                    htmlFor="password"
                    className="block text-sm font-semibold leading-6 text-slate-50"
                    >
                    Пароль:
                    </label>
                    <div className="mt-2">
                    <input
                        id="password"
                        onChange={(event) =>
                        setForm({ ...form, password: event.target.value })
                        }
                        placeholder="Password"
                        name="password"
                        type="password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                    />
                    </div>
                </div>
        
                <div>
                    <label
                    htmlFor="password"
                    className="block text-sm font-semibold leading-6 text-slate-50"
                    >
                    Подтвердите пароль:
                    </label>
                    <div className="mt-2">
                    <input
                        id="password2"
                        onChange={(event) =>
                        setForm({ ...form, password2: event.target.value })
                        }
                        placeholder="Password"
                        name="password"
                        type="password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                    />
                    </div>
                </div>
        
                <article>
                    <loaders.Loader1 isView={userRegister.load} />
                    {userRegister.error && (
                    <div className="alert alert-danger" role="alert">
                        {userRegister.error}
                    </div>
                    )}
                    {userRegister.fail && (
                    <div className="alert alert-danger" role="alert">
                        {userRegister.fail}
                    </div>
                    )}
                    {userRegister.data && (
                    <div
                        className="w-full h-12 bg-green-500 text-slate-50 text-bold text-m rounded mt-3 flex items-center justify-center font-semibold"
                        role="alert"
                    >
                        Вы успешно Зарегистрировались
                    </div>
                    )}
                </article>
        
                <div className="mt-10">
                    <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                    Зарегистрироваться
                    </button>
                </div>
                </form>
            </div>
            </div>
        );
    }