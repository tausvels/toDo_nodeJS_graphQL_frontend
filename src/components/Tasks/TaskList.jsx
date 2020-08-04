import React from 'react';
import TaskListItem from './TaskListItem';
import './taskItem.css'

function TaskList({tasks, authUserId, onDeleteTask, onEditTask}) {
  const taskList = tasks.map(task => (
    <TaskListItem 
      key={task._id} 
      task={task} 
      userId={authUserId}
      
      onDelete={(id)=>onDeleteTask(id)}
      onEdit={( taskId ) => onEditTask(taskId)}
    />
  ));
  return (
  <ul className="task__list">{taskList}</ul>
  );
}

export default TaskList;