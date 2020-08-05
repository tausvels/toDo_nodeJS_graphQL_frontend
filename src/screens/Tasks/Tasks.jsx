import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../../context/auth-context';
import Modal from '../../components/Modal/Modal';
import Backdrop from '../../components/Backdrop/Backdrop';

import './tasks.css';
import TaskList from '../../components/Tasks/TaskList';
import Spinner from '../../components/Spinner/Spinner';
import TaskForm from '../../components/TaskForm/TaskForm';

function Tasks(props) {
  const {match: {params}} = props;
  let searchTerm = '';
  if (params.category) {console.log('param --> ', params.category); searchTerm = params.category}
  console.log('searchTerm --> ', searchTerm);
  const {authState} = useContext(AuthContext);
  const [creating, setCreating] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const titleEl = useRef();
  const descriptionEl = useRef();
  const dateEl = useRef();
  const categoryEl = useRef();

  const startCreatingTaskHandler = () => { setCreating(true) }
  const modalCancelHandler = () => {
    setCreating(false)
    setSelectedTask(false);
  };
  const modalConfirmHandler = async () => {
    setCreating(false)
    const title = titleEl.current.value;
    const description = descriptionEl.current.value;
    const date = dateEl.current.value;
    const category = categoryEl.current.value.toLowerCase();
    if (title.trim().length === 0 || description.trim().length === 0 || date.trim().length === 0 || category.trim().length === 0) {
      return;
    }
    const requestBody = {
      query: `
        mutation {
          createTask(taskInput:{title:"${title}", description:"${description}", date:"${date}", category:"${category}"}){
            _id, title, description, date, category
          }
        }
      `
    }
    try {
      const result = await fetch("http://localhost:3001/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {  
        "Content-type": "application/json", 
        "Authorization": "Bearer " + authState.token  
      }
    });
      if (result.status !== 200 && result.status !== 201) {
        console.log('I have failed'); 
        throw new Error ('Failed')
      } 
      const resultBody = await result.json();
      const addedTask = {
          _id: resultBody.data.createTask._id,
          title: resultBody.data.createTask.title,
          description: resultBody.data.createTask.description,
          date: resultBody.data.createTask.date,
          category: resultBody.data.createTask.category,
          creator: {
            _id: authState.userId,
            email: authState.email 
          }
      }
      setTasks(preVstate => ([addedTask, ...preVstate]))
    } catch (err) {
      throw err
    }
  }

  const fetchTasks = async () => {
    setIsLoading(true);
    let requestBody;
    if (searchTerm) {
      requestBody = {
        query: `
        query { filterTasksBy(filter:"${searchTerm}") {_id, title, description, date, category, creator {_id, email}} }
      `
    }
    } else {
      requestBody = {query: `
      query {getAllTasks { _id, title, description, date, category, creator {_id, email} } } `
    };
    }
    try {
      const result = await fetch("http://localhost:3001/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {  "Content-type": "application/json"  }
    });
      if (result.status !== 200 && result.status !== 201) {
        console.log('Check query string because I have failed to bring in the data!'); 
        throw new Error ('Failed')
      }
      const resultBody = await result.json();console.log(resultBody)
      // const allTasks = resultBody.data.tasks;
      let allTasks;
      if (searchTerm) {allTasks = resultBody.data.filterTasksBy} else {allTasks = resultBody.data.getAllTasks}
      setTasks(allTasks);
      setIsLoading(false);
    } catch (err) {
      console.log(err)
      setIsLoading(false);
      throw err;
    }
  };

  const deleteTaskHandler = async (taskId) => {
    // const taskSelected = tasks.find(task => task._id === taskId);
    const requestBody = 
    {
      query: `mutation { deleteTask(taskId:"${taskId}") {_id, title, description, date, category }}`
    }
    try {
      const result = await fetch("http://localhost:3001/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {  
          "Content-type": "application/json", 
          "Authorization": "Bearer " + authState.token  
        }
      });
      if (result.status !== 200 && result.status !== 201) {
        console.log('I have failed'); 
        throw new Error ('Failed')
      } 
      const resultBody = await result.json();
      console.log('result body after delete --->> ',resultBody)
      if (resultBody.data.deleteTask._id !== taskId) {
        console.log('Failed to delete')
        throw new Error ('Failed to delete')
      }
      setTasks(tasks.filter(task => task._id !== taskId))
    } catch (err) {
      console.log('errrr----> ',err)
      throw err
    }
  };

  const editTaskHandler = (taskId) => {
    const taskSelected = tasks.find(task => task._id === taskId);
    setSelectedTask(taskSelected); // <-- For populating form fields
  }

  const modalUpdateHandler = async () => {
    console.log('I am running ', selectedTask._id)
    const title = titleEl.current.value;
    const description = descriptionEl.current.value;
    const date = dateEl.current.value;
    const category = categoryEl.current.value.toLowerCase();
    if (title.trim().length === 0 || description.trim().length === 0 || date.trim().length === 0 || category.trim().length === 0) {
      return;
    }
    const requestBody = {
      query: `
        mutation {
          updateTask(updateTaskInput:{_id:"${selectedTask._id}", title:"${title}", description:"${description}", date:"${date}", category:"${category}"}){
            _id, title, description, date, category
          }
        }
      `
    }
    const result = await fetch("http://localhost:3001/graphql", {
      method: "POST", body: JSON.stringify(requestBody), 
      headers: {"Content-type": "application/json", "Authorization": "Bearer " + authState.token}
    });
    if (result.status !== 200 && result.status !== 201) {throw new Error("Failed to Update")}
    const resultBody = await result.json();console.log(resultBody)
    const updatedTask = {
      _id: resultBody.data.updateTask._id,
      title: resultBody.data.updateTask.title,
      description: resultBody.data.updateTask.description,
      date: resultBody.data.updateTask.date,
      category: resultBody.data.updateTask.category,
      creator: {_id: authState.userId, email: authState.email 
      }
    }
    console.log('updated task -> ',updatedTask._id)
    console.log('tasks[0] -> ', tasks[0]._id)
    const indexOfUpdatedTask = tasks.indexOf(tasks.find(task => task._id === updatedTask._id));
    console.log(indexOfUpdatedTask)
    setTasks(prevState => insertTaskToArray(prevState, updatedTask, indexOfUpdatedTask))
    setSelectedTask(null)
  }
  const insertTaskToArray = (arr, obj, ind) => {
    arr.splice(ind, 1, obj);
    const newArr = arr;
    return newArr;
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      {authState.userId && (
        <div className='tasks-control'>
          {creating && <Backdrop />}
          {creating && (
            <Modal 
              title='Add Event' 
              canCancel 
              canConfirm
              onCancel={modalCancelHandler}
              onConfirm={modalConfirmHandler}
            >
             <TaskForm titleEl={titleEl} descriptionEl={descriptionEl} 
              dateEl={dateEl} categoryEl={categoryEl}
            /> 
            </Modal>
            )}
          <p>Create your ToDo Item</p>
          <button className='btn' onClick={startCreatingTaskHandler}>Create ToDo Item</button>
        </div>
      )}
      {selectedTask && (
        <>
          <Backdrop />
          <Modal 
            title={selectedTask.title} 
            canCancel 
            canUpdate
            onCancel={modalCancelHandler}
            onUpdate={modalUpdateHandler}
          >
            <TaskForm 
              title={selectedTask.title} titleEl={titleEl} 
              description={selectedTask.description} descriptionEl={descriptionEl} 
              date={selectedTask.date} dateEl={dateEl} 
              category={selectedTask.category} categoryEl={categoryEl}
            /> 
          </Modal>
        </>
      )}
      {isLoading ? 
      <Spinner />
      : 
      <TaskList 
        tasks={tasks} 
        authUserId={localStorage.getItem("userId")}
        onDeleteTask={( taskId ) => deleteTaskHandler(taskId)}
        onEditTask={ ( taskId ) => editTaskHandler(taskId)}
      />}
    </>
  );
}

export default Tasks;