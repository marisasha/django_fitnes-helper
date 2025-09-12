import { useUser } from "../components/profile";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as bases from "../components/bases";
import * as components from "../components/components";
import * as constants from "../components/constants";

export default function Page() {
  const user: any = useUser();
  const dispatch = useDispatch();
  const workout = useSelector((state: any) => state.workoutList);

  // Получение тренировок
  const getWorkout = async () => {
    if (!user) return;
    const url = `${constants.host}/api/all/workouts/planned/user/${user.user_id}`;
    try {
      await components.constructorWebAction(dispatch, constants.workoutList, url, "GET");
    } catch (err) {
      console.error("Ошибка при загрузке тренировок:", err);
    }
  };

  useEffect(() => {
    getWorkout();
  }, [user]);

  const hasWorkouts = workout?.data && workout.data.length > 0;

  return (
    <bases.Base>
      <div className="w-full mt-28 ml-20 flex ">
        <div className="flex flex-col gap-y-5">
          <div >
            <Link to="/workouts/create-workout/">
              <div className="w-60 flex justify-center p-2 text-center bg-cyan-600 hover:bg-slate-100 rounded-3xl">
                <h1 className="text-xl font-bold leading-9 tracking-tight text-slate-100 hover:text-cyan-600">
                  Создать план тренировки
                </h1>
              </div>
            </Link>
          </div>

          <h1 className="text-3xl font-bold leading-9 tracking-tight text-slate-100 mb-10">
            Ваши запланированные тренировки:
          </h1>

          {!hasWorkouts && (
            <p className="w-full text-lg text-slate-200">
              
            </p>
          )}

          {hasWorkouts && (
            <div className="flex flex-wrap gap-x-5 gap-y-10">
              {workout.data.map((item: any) => (
                <div
                  key={item.id}
                  className="flex gap-x-10 w-1/3 rounded-2xl bg-white"
                >
                  <img
                    height={100}
                    width={150}
                    src="https://img3.akspic.ru/crops/7/7/7/0/20777/20777-kulturist-struktura-ruka-myshca-uprazhnenie-1080x1920.jpg"
                    alt={`fitness-${item.id}`}
                    className="rounded-s-lg "
                  />

                  <div className="flex flex-col items-center text-center gap-y-7 text-3xl text-slate-800 mt-2">
                    <h1 className="font-bold leading-9 tracking-tight">{item.name}</h1>
                    <div className="text-lg">
                      <h1>Количество упражнений: {item.exercises_count}</h1>
                      <h1>
                        Тип тренировки:{" "}
                        <span className="text-sm bg-yellow-400 border rounded-lg px-2 py-0.5">
                          {item.type ?? "Не указан"}
                        </span>
                      </h1>
                    </div>
                    <Link to={`/workouts/training/${item.id}/user/${user.user_id}`}>
                      <div className="mt-5 flex text-center justify-center bg-cyan-600 hover:bg-slate-100 rounded-3xl">
                        <h1 className="p-2 text-lg font-bold leading-9 tracking-tight text-slate-100 hover:text-cyan-600">
                          Начать тренировку
                        </h1>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </bases.Base>
  );
}
