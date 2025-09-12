
import { constructorConstant } from "../components/components";

export const isDebug = true; 
export const host = "http://127.0.0.1:8000";

// app
export const workoutList = constructorConstant("workoutList");


// user
export const userRegister = constructorConstant("userRegister");
export const userLogin = constructorConstant("userLogin");
export const userUpdate = constructorConstant("userUpdate");
export const userProfile = constructorConstant("userProfile");