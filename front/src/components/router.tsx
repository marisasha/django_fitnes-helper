// external
import { BrowserRouter, Routes, Route } from "react-router-dom";

// base

import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Register from "../pages/Register";
import Workouts from "../pages/Workouts"
import CreateWorkout from "../pages/CreateWorkout"
import Workout from "../pages/Workout"


export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* base */}
        <Route path={"register/"} element={<Register />}></Route>
        <Route path={"/"} element={<Login />}></Route>
        <Route path={"logout/"} element={<Logout />}></Route>

        <Route path={"workouts/"} element={<Workouts/>}></Route>
        <Route path={"workouts/create-workout/"} element={<CreateWorkout/>}></Route>
        <Route path="/workouts/training/:workoutId/user/:userId" element={<Workout />} />
        {/* safe redirect */}
      </Routes>
    </BrowserRouter>
  );
}