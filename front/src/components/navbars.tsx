import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as utils from "../components/utils";
import * as components from "../components/components";
import * as constants from "../components/constants";

export function Navbar() {
  const roleList = useSelector((state: any) => state.roleList);
  const dispatch = useDispatch();

  // async function fetchRolesData() {
  //   //@ts-ignore
  //   components.constructorWebAction(
  //     dispatch,
  //     //@ts-ignore
  //     constants.roleList,
  //     //@ts-ignore
  //     `${constants.host}/api/create/task/`,
  //     "GET"
  //   );
  // }

  // useEffect(() => {
  //   fetchRolesData();
  // }, []);

  // useEffect(() => {
  //   if (roleList && roleList.data) {
  //     console.log("Роли загружены:", roleList.data); 
  //     const { authors, executors, inspectors ,boss} = roleList.data;

  //     const userIsAuthor = authors.some((author: any) => author.id === userId);
  //     const userIsBoss = boss.some((author: any) => author.id === userId);
  //     console.log("Пользователь автор:", userIsAuthor); 

  //     if (userIsAuthor) {
  //       setAuthorRole("author");
  //     }
  //     if (userIsBoss) {
  //       setBossRole("boss");
  //     } 
  //   }
  // }, [roleList, userId]);


  return (
    <nav className="m-0 flex flex-col justify-between w-full fixed top-0 left-0 bg-slate-100 border rounded-b-3xl" aria-label="Global">
      
      <div className="flex items-end ml-5 gap-x-5 mt-2 mb-3 ">
        
        <div className="flex items-end text-l font-semibold leading-6 text-cyan-600 hover:text-gray-600">
          <span className="text-5xl">Fitnes</span>
          <span className="">helper</span>
        </div>

        <div className={"flex gap-x-5"}>
          <div className="flex gap-x-12 items-center">
            <Link to="/tasks" className="text-l font-semibold leading-6 text-cyan-600 hover:text-gray-600 flex gap-x-2 items-center">
              <i className="fa-solid fa-house"></i>
              <span>Главная</span>
            </Link>
          </div>
          <div className="flex gap-x-12 items-center">
            <Link to="/workouts" className="text-l font-semibold leading-6 text-cyan-600 hover:text-gray-600 flex gap-x-2 items-center ">
              <i className="fa-solid fa-dumbbell"></i>
              <span>Тренировки</span>
            </Link>
          </div>
          
          <div className="flex gap-x-12 items-center">
            <Link to="/archive_tasks" className="text-l font-semibold leading-6 text-cyan-600 hover:text-gray-600 flex gap-x-2 items-center ">
              <i className="fa-solid fa-square-poll-vertical"></i>
              <span>Статистика</span>
            </Link>
          </div>
        <div className="flex gap-x-12 items-center">
            <Link to="/archive_tasks" className="text-l font-semibold leading-6 text-cyan-600 hover:text-gray-600 flex gap-x-2 items-center ">
              <i className="fa-solid fa-user"></i>
              <span>Профиль</span>
            </Link>
          </div>
        </div>

      </div>

    </nav>
  );
}