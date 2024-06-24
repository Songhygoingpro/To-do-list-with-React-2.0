import React, { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import star_task_completed from "../img/star-task-completed.png";

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [completed, setCompleted] = useState(0);
  const [editIndex, setEditIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [quotes, setQuotes] = useState("");
  const [author, setAuthor] = useState("");
  const category = ["happiness", "freedom", "life", "love", "imagination"];
  const url = "https://api.api-ninjas.com/v1/quotes?category=" + category[0];
  const apiKey = "ME6tUsrNFGvgRQMQ4dyidw==rWXPoG36hoUB83Xs";

  useEffect(() => {
    getQuote();
  }, []);

  const getQuote = () => {
    fetch(url, {
      method: "GET",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((result) => {
        const random = Math.floor(Math.random() * result.length);
        setQuotes(result[random].quote);
        setAuthor(result[random].author);
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      if (isEditing) {
        const updatedTasks = tasks.map((task, index) =>
          index === editIndex ? { ...task, text: newTask } : task
        );
        setTasks(updatedTasks);
        setIsEditing(false);
        setEditIndex(null);
      } else {
        setTasks([...tasks, { id: Date.now(), text: newTask, isChecked: false }]);
      }
      setNewTask("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const handleDelete = (idToDelete) => {
    const newTasks = tasks.filter((task) => task.id !== idToDelete);
    setTasks(newTasks);
    updateCompletedCount(newTasks);
  };

  const handleEdit = (task, index) => {
    setNewTask(task.text);
    setEditIndex(index);
    setIsEditing(true);
  };

  const handleCheckboxChange = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, isChecked: !task.isChecked } : task
    );
    setTasks(newTasks);
    updateCompletedCount(newTasks);
  };

  const updateCompletedCount = (tasks) => {
    const completedCount = tasks.filter((task) => task.isChecked).length;
    setCompleted(completedCount);
  };

  return (
    <div className="To_do text-black flex items-center justify-center px-4 overflow-x-hidden">
      <div className="To_do_container grid container w-[100%] bg-white">
        <div className="To_do_x">
          <div className="border-0 md:border-x-4 md:border-b-4 max-w-[100%] w-auto justify-center gap-8 md:border-black flex flex-col-reverse md:flex-row items-start  py-6 px-0 md:px-4">
            <h1 className="To_do_title text-4xl">To-Do List</h1>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                placeholder="Enter your tasks"
                value={newTask}
                onKeyDown={handleKeyDown}
                onChange={({ target }) => {
                  setNewTask(target.value);
                }}
                className="indent-4 border-2 rounded-xl w-full md:max-w-full md:w-[20rem] h-14 border-black"
                type="text"
              />
              <button
                onClick={addTask}
                className="text-center border-2 rounded-xl py-2 px-6 border-black"
              >
                {isEditing ? "Confirm" : "Add"}
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1">
            <div className=" border-black overflow-y-auto max-h-auto md:max-h-[400px]">
              <ul
                id="task-container"
                className="py-6 px-0 md:px-4  pt-4 gap-6  flex flex-col items-start overflow-x-auto"
              >
                <TransitionGroup component={null}>
                  {tasks.map((task, index) => (
                    <CSSTransition
                      key={task.id}
                      timeout={500}
                      classNames="task"
                    >
                      <li className="task border-2 shadow-[0px_8px_0px_black] px-4 rounded-2xl flex border-black gap-4 md:gap-8 w-auto h-auto text-start p-4 overflow-x-scroll">
                        <div className="flex gap-4 overflow-x-scroll">
                          <input
                            type="checkbox"
                            checked={task.isChecked}
                            onChange={() => handleCheckboxChange(index)}
                            className="w-7 h-7"
                          />
                          <p className="tasks text-xl md:text-2xl font-semibold overflow-x-scroll ">{task.text}</p>
                        </div>
                        <div className="flex gap-2 md:gap-4 overflow-x-auto">
                          <button
                            onClick={() => handleEdit(task, index)}
                            className=""
                          >
                            <img
                              src="https://www.svgrepo.com/show/522527/edit-3.svg"
                              className="w-6 md:w-8 h-6 md:h-8"
                              alt="Edit"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className=""
                          >
                            <img
                              src="https://www.svgrepo.com/show/502614/delete.svg"
                              className="w-6 md:w-8 h-6 md:h-8"
                              alt="Delete"
                            />
                          </button>
                        </div>
                      </li>
                    </CSSTransition>
                  ))}
                </TransitionGroup>
              </ul>
            </div>
            <div className="md:border-4 border-0 p-0 md:p-6 pt-4 gap-8 md:border-b-0 md:border-l-4 md:border-t-0 flex flex-col md:border-black">
              <div className="flex flex-col gap-4">
                <h1 className="text-2xl text-start">Daily Affirmation</h1>
                <button
                  onClick={getQuote}
                  className="flex flex-col gap-2 border-4 border-black hover:shadow-[4px_4px_0px_black] hover:-translate-x-1 hover:-translate-y-1 active:shadow-none transition-all active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl rounded-2xl  w-[100%] max-h-[100%] text-start p-4"
                >
                  <div className="font-medium">{quotes}</div>
                  <i className="font-medium">- {author}</i>
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <h1 className="text-2xl text-start">Completed Tasks</h1>
                <div className="border-4 flex justify-between rounded-2xl px-6 border-black max-w-[14rem] h-[6rem] max-h-[100%] text-start p-4">
                  <img
                    className="max-w-[3rem] w-full h-auto"
                    src={star_task_completed}
                    alt=""
                  />
                  <div className="flex flex-col items-center">
                    <h1 className="text-3xl num-tasks">
                      {completed}/{tasks.length}
                    </h1>
                    <p className="">Tasks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToDoList;
