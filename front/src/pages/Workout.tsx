import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import * as bases from "../components/bases";
import * as utils from "../components/utils";
import { refreshAccessToken } from "../components/token"; // 🔹 импортируем

export default function WorkoutPage() {
  const { workoutId, userId } = useParams(); 
  const navigate = useNavigate();
  const [plan, setPlan] = useState<any>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [doneData, setDoneData] = useState<any[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Утилита для запросов с токеном и авто-refresh
  async function axiosWithAuth(config: any) {
    let access = utils.LocalStorage.get("userLogin.data.access");
    if (!access) throw new Error("Access token not found");

    config.headers = {
      ...config.headers,
      Authorization: `Sasha ${access}`,
    };

    try {
      return await axios(config);
    } catch (err: any) {
      if (err.response?.status === 401) {
        access = await refreshAccessToken();
        if (!access) throw new Error("Не удалось обновить токен");

        config.headers = {
          ...config.headers,
          Authorization: `Sasha ${access}`,
        };
        return await axios(config);
      }
      throw err;
    }
  }

  // Загружаем план тренировки
  useEffect(() => {
    async function fetchWorkout() {
      try {
        const res = await axiosWithAuth({
          method: "GET",
          url: `http://127.0.0.1:8000/api/workout/planned/info/${workoutId}/user/${userId}`,
        });

        setPlan(res.data.data);

        // Подготовим пустые данные для заполнения пользователем
        setDoneData(
          res.data.data.exercises.map((ex: any) => ({
            name: ex.name,
            approaches: ex.approaches.map(() => ({
              factual_time: 0,
              speed_exercise_equipment: 0,
              weight_exercise_equipment: 0,
              count_approach: 0,
            })),
          }))
        );
      } catch (err) {
        console.error("Ошибка загрузки плана:", err);
      }
    }
    fetchWorkout();
  }, [workoutId, userId]);

  // Таймер
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted) {
      timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted]);

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function updateDoneApproach(exIndex: number, apIndex: number, field: string, value: number) {
    const updated = [...doneData];
    updated[exIndex].approaches[apIndex][field] = value;
    setDoneData(updated);
  }

  async function finishWorkout() {
    try {
      const payload = {
        workout_id: Number(workoutId),
        exercises: doneData.map((ex) => ({
          name: ex.name,
          //@ts-ignore
          approaches: ex.approaches.map((ap) => ({
            factual_time: ap.factual_time || 0,
            speed_exercise_equipment: ap.speed_exercise_equipment || 0,
            weight_exercise_equipment: ap.weight_exercise_equipment || 0,
            count_approach: ap.count_approach || 0,
          })),
        })),
      };

      await axiosWithAuth({
        method: "POST",
        url: "http://127.0.0.1:8000/api/input/workout/data",
        data: payload,
      });

      alert("✅ Тренировка завершена и сохранена!");
      navigate("/workouts");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Ошибка при сохранении данных о тренировке");
    }
  }

  if (!plan) {
    return (
      <bases.Base>
        <div className="p-5 text-center text-lg">Загрузка плана тренировки...</div>
      </bases.Base>
    );
  }

  const currentExercise = plan.exercises[currentExerciseIndex];

  return (
    <bases.Base>
      <div className="w-full mt-32 flex">
        <div className="m-auto flex flex-col gap-y-5 w-full max-w-4xl">
          <div className="flex flex-col items-center gap-y-5">
            <h1 className="text-3xl text-center font-bold text-slate-100">{plan.name}</h1>
            <h2 className="w-2/12 p-1 text-lg text-center bg-yellow-400 text-slate-100 rounded-lg">{plan.type}</h2>
          </div>

          {/* Блок упражнения */}
          <div className="border p-4 rounded-2xl bg-white shadow space-y-4">
            <h3 className="text-lg font-semibold">
              Упражнение {currentExerciseIndex + 1}: {currentExercise.name}
            </h3>

            <div className="grid grid-cols-2 gap-6">
              {/* План */}
              <div>
                <h4 className="font-semibold mb-2">Запланировано</h4>
                {currentExercise.approaches.map((ap: any, idx: number) => (
                  <div key={idx} className="border p-2 rounded-lg mb-2">
                    ⏱ {ap.planned_time || 0} сек | ⚡ {ap.speed_exercise_equipment || 0} | 🏋️ {ap.weight_exercise_equipment || 0} кг | 🔁 {ap.count_approach}
                  </div>
                ))}
              </div>

              {/* Факт */}
              <div>
                <h4 className="font-semibold mb-2">Фактически</h4>
                {/* @ts-ignore */}
                {doneData[currentExerciseIndex].approaches.map((ap, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
                    <input
                      type="number"
                      className="border p-2 rounded-lg"
                      placeholder="Время"
                      value={ap.factual_time}
                      onChange={(e) =>
                        updateDoneApproach(currentExerciseIndex, idx, "factual_time", +e.target.value)
                      }
                    />
                    <input
                      type="number"
                      className="border p-2 rounded-lg"
                      placeholder="Скорость"
                      value={ap.speed_exercise_equipment}
                      onChange={(e) =>
                        updateDoneApproach(currentExerciseIndex, idx, "speed_exercise_equipment", +e.target.value)
                      }
                    />
                    <input
                      type="number"
                      className="border p-2 rounded-lg"
                      placeholder="Вес"
                      value={ap.weight_exercise_equipment}
                      onChange={(e) =>
                        updateDoneApproach(currentExerciseIndex, idx, "weight_exercise_equipment", +e.target.value)
                      }
                    />
                    <input
                      type="number"
                      className="border p-2 rounded-lg"
                      placeholder="Повторения"
                      value={ap.count_approach}
                      onChange={(e) =>
                        updateDoneApproach(currentExerciseIndex, idx, "count_approach", +e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Навигация */}
            <div className="flex justify-between">
              <button
                disabled={currentExerciseIndex === 0}
                onClick={() => setCurrentExerciseIndex((i) => i - 1)}
                className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300"
              >
                ⬅️
              </button>
              <button
                disabled={currentExerciseIndex === plan.exercises.length - 1}
                onClick={() => setCurrentExerciseIndex((i) => i + 1)}
                className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300"
              >
                ➡️
              </button>
            </div>
          </div>

          {/* Управление тренировкой */}
          <div className="flex justify-between items-center mt-4">
            {!isStarted ? (
              <button
                onClick={() => setIsStarted(true)}
                className="text-lg bg-cyan-600 text-slate-100 px-5 py-3 rounded-2xl hover:bg-slate-100 hover:text-cyan-600"
              >
                ▶️ Начать тренировку
              </button>
            ) : (
              <>
                <button
                  onClick={finishWorkout}
                  className="text-lg bg-red-600 text-slate-100 px-5 py-3 rounded-2xl hover:bg-slate-100 hover:text-red-600"
                >
                  ⏹ Завершить тренировку
                </button>
                <div className="text-xl text-slate-100 font-bold">⏱ {formatTime(seconds)}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </bases.Base>
  );
}
