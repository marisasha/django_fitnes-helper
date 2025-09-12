import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshAccessToken } from "./token";
import axios from "axios";

export function constructorConstant(prefix: string) {
  return {
    load: `load_${prefix}`,
    success: `success_${prefix}`,
    fail: `fail_${prefix}`,
    error: `error_${prefix}`,
    reset: `reset_${prefix}`,
  };
}

export function constructorReducer(constant: any) {
  return function (state = {}, action: { type: string; payload: any }) {
    switch (action.type) {
      case constant.load:
        return { load: true };
      case constant.success:
        return { load: false, data: action.payload };
      case constant.fail:
        return { load: false, fail: action.payload };
      case constant.error:
        return { load: false, error: action.payload };
      case constant.reset:
        return { load: false };
      default:
        return state;
    }
  };
}



export async function constructorWebAction(
  dispatch: any,
  constant: any,
  url: string,
  method: string = "GET",
  headers: any = {},
  data: any = {},
  timeout: number = 5000,
  isExtra: boolean = false,
) {
  dispatch({ type: constant.load });

  // Универсальная функция для отправки запроса с токеном
  const makeRequest = async (token: string) => {
    const config: any = {
      url,
      method,
      timeout,
      headers: { ...headers, Authorization: `Sasha ${token}` },
    };
    if (method.toUpperCase() !== "GET") {
      config.data = data;
    }
    return axios(config);
  };

  try {
    // Берём токен из LocalStorage
    let access = localStorage.getItem("userLogin.data.access");
    if (!access) access = "";

    let response;
    try {
      response = await makeRequest(access);
    } catch (err: any) {
      // Если 401 — пробуем рефрешить токен
      if (err.response?.status === 401) {
        const newAccess = await refreshAccessToken();
        if (!newAccess) throw new Error("Не удалось обновить токен");
        response = await makeRequest(newAccess);
      } else {
        throw err;
      }
    }

    if (response.status === 200 || response.status === 201) {
      dispatch({
        type: constant.success,
        payload: isExtra ? response.data : response.data.data,
      });
    } else {
      dispatch({ type: constant.error, payload: response.statusText });
    }
  } catch (error: any) {
    console.error(`constructorWebAction: ${url} ${method}`, error);
    dispatch({ type: constant.fail, payload: "Свяжитесь с администратором" });
  }
}
