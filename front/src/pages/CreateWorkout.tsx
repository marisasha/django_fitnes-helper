import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../components/profile";
import * as bases from "../components/bases";

export default function CreateWorkoutPage() {
  const user: any = useUser();

  const [plan, setPlan] = useState({
    name: "",
    type: "",
    user: 0,
    exercises: [
      {
        name: "",
        approaches: [
          {
            planned_time: 0,
            speed_exercise_equipment: 0,
            weight_exercise_equipment: 0,
            count_approach: 0,
          },
        ],
      },
    ],
  });

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);

  useEffect(() => {
    if (user?.user_id) {
      setPlan((prev) => ({ ...prev, user: user.user_id }));
    }
  }, [user]);

  function addExercise() {
    const newExercise = {
      name: "",
      approaches: [
        {
          planned_time: 0,
          speed_exercise_equipment: 0,
          weight_exercise_equipment: 0,
          count_approach: 0,
        },
      ],
    };
    setPlan((prev) => ({ ...prev, exercises: [...prev.exercises, newExercise] }));
    setCurrentExerciseIndex(plan.exercises.length);
  }

  function deleteExercise(index: number) {
    if (plan.exercises.length === 1) return;
    const updated = plan.exercises.filter((_, i) => i !== index);
    setPlan({ ...plan, exercises: updated });
    // @ts-ignore
    setCurrentExerciseIndex(updated.length ? 0 : null);
  }

  function updateExercise(field: string, value: any) {
    const updated = [...plan.exercises];
    // @ts-ignore
    updated[currentExerciseIndex!][field] = value;
    setPlan({ ...plan, exercises: updated });
  }

  function updateApproach(idx: number, field: string, value: any) {
    const updated = [...plan.exercises];
    // @ts-ignore
    updated[currentExerciseIndex!].approaches[idx][field] = value;
    setPlan({ ...plan, exercises: updated });
  }

  function addApproach() {
    const updated = [...plan.exercises];
    updated[currentExerciseIndex!].approaches.push({
      planned_time: 0,
      speed_exercise_equipment: 0,
      weight_exercise_equipment: 0,
      count_approach: 0,
    });
    setPlan({ ...plan, exercises: updated });
  }

  async function savePlan() {
    if (!user?.user_id) return;

    // 🔹 Проверка обязательных полей
    if (!plan.name.trim()) {
      alert("Введите название тренировки");
      return;
    }
    if (!plan.type.trim()) {
      alert("Выберите тип тренировки");
      return;
    }
    for (let i = 0; i < plan.exercises.length; i++) {
      if (!plan.exercises[i].name.trim()) {
        alert(`Введите название для упражнения №${i + 1}`);
        return;
      }
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/create/workout", plan);
      alert("План успешно создан!");
      setPlan({
        name: "",
        type: "",
        user: user.user_id,
        exercises: [
          {
            name: "",
            approaches: [
              {
                planned_time: 0,
                speed_exercise_equipment: 0,
                weight_exercise_equipment: 0,
                count_approach: 0,
              },
            ],
          },
        ],
      });
      setCurrentExerciseIndex(0);
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      alert("Ошибка при создании плана");
    }
  }

  if (!user) {
    return (
      <bases.Base>
        <div className="p-5">
          <h1 className="text-xl font-bold">Профиль</h1>
          <p>Вы не авторизованы</p>
        </div>
      </bases.Base>
    );
  }

  return (
    <bases.Base>
      <div className="w-full mt-28 ml-20 flex">
        <div className="m-auto flex flex-col gap-y-5 w-full max-w-3xl">
          <h1 className="text-3xl text-center font-bold leading-9 tracking-tight text-slate-100">
            Заполните план тренировки
          </h1>

          {/* Основные поля */}
          <input
            className="border p-2 w-full rounded-lg"
            placeholder="Название тренировки"
            value={plan.name}
            onChange={(e) => setPlan({ ...plan, name: e.target.value })}
            required
          />
          <select
            className="border h-10 w-full rounded-2xl"
            value={plan.type}
            onChange={(e) => setPlan({ ...plan, type: e.target.value })}
            required
          >
            <option value="">Выберите тип тренировки</option>
            <option value="Силовая">Силовая</option>
            <option value="Функциональная">Функциональная</option>
            <option value="Кардио">Кардио</option>
            <option value="Растяжка">Растяжка</option>
            <option value="Смешанная">Смешанная</option>
          </select>

          {/* Блок упражнения */}
          {currentExerciseIndex !== null && (
            <div className="border p-4 rounded-2xl bg-white shadow space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  Упражнение {currentExerciseIndex + 1}
                </h2>
                <div className="flex gap-x-3">
                  <button
                    className="bg-red-500 text-white rounded-lg px-3 py-1"
                    onClick={() => deleteExercise(currentExerciseIndex)}
                  >
                    Удалить
                  </button>
                  <button
                    className="bg-cyan-600 text-white rounded-lg px-3 py-1"
                    onClick={addApproach}
                  >
                    + Добавить подход
                  </button>
                  <button
                    className="bg-cyan-600 text-white rounded-lg px-3 py-1"
                    onClick={addExercise}
                  >
                    + Добавить упражнение
                  </button>
                </div>
              </div>

              <input
                className="border p-2 w-full rounded-lg"
                placeholder="Название упражнения"
                value={plan.exercises[currentExerciseIndex]?.name || ""}
                onChange={(e) => updateExercise("name", e.target.value)}
                required
              />

              {/* Подходы */}
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-4 gap-2 font-semibold text-slate-700 ml-12">
                  <span>Время</span>
                  <span>Скорость</span>
                  <span>Вес</span>
                  <span>Количество повторений</span>
                </div>

                {plan.exercises[currentExerciseIndex].approaches.map((ap, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-2">
                    <input
                      type="number"
                      className="border p-2 rounded-lg"
                      placeholder="Время"
                      value={ap.planned_time}
                      onChange={(e) => updateApproach(idx, "planned_time", +e.target.value)}
                    />
                    <input
                      type="number"
                      className="border p-2 rounded-lg"
                      placeholder="Скорость"
                      value={ap.speed_exercise_equipment}
                      onChange={(e) =>
                        updateApproach(idx, "speed_exercise_equipment", +e.target.value)
                      }
                    />
                    <input
                      type="number"
                      className="border p-2 rounded-lg"
                      placeholder="Вес"
                      value={ap.weight_exercise_equipment}
                      onChange={(e) =>
                        updateApproach(idx, "weight_exercise_equipment", +e.target.value)
                      }
                    />
                    <input
                      type="number"
                      className="border p-2 rounded-lg"
                      placeholder="Повторения"
                      value={ap.count_approach}
                      onChange={(e) =>
                        updateApproach(idx, "count_approach", +e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Навигация */}
              <div className="flex justify-between">
                <button
                  disabled={currentExerciseIndex === 0}
                  onClick={() => setCurrentExerciseIndex((i) => i! - 1)}
                  className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300"
                >
                  ⬅️
                </button>
                <button
                  disabled={currentExerciseIndex === plan.exercises.length - 1}
                  onClick={() => setCurrentExerciseIndex((i) => i! + 1)}
                  className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300"
                >
                  ➡️
                </button>
              </div>
            </div>
          )}

          {/* Сохранить */}
          <button
            onClick={savePlan}
            className="w-full bg-green-600 text-white px-5 py-3 rounded-2xl hover:bg-green-700"
          >
            💾 Сохранить план
          </button>
        </div>
      </div>
    </bases.Base>
  );
}
