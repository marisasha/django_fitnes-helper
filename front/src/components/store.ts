import { configureStore } from "@reduxjs/toolkit";
import * as components from "./components";
import * as constants from "./constants";
export const store = configureStore({
  reducer: {
    // @ts-ignore
    userRegister: components.constructorReducer(constants.userRegister),
    // @ts-ignore
    userLogin: components.constructorReducer(constants.userLogin),
    // @ts-ignore
    userUpdate: components.constructorReducer(constants.userUpdate),
    // @ts-ignore
    userProfile: components.constructorReducer(constants.userProfile),
    // @ts-ignore
    workoutList: components.constructorReducer(constants.workoutList),

    
  },
});
export default store;