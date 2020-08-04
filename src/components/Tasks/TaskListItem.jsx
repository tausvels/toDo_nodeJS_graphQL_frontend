import React from 'react';

function TaskListItem({ task, userId, onDelete, onEdit }) {
  return (
    <li key={task._id} className="tasks__list-item">
      <div>
        <h1>{task.title}</h1>
        <h3>{task.description}</h3>
        <h3>Date Scheduled: {new Date(task.date).toLocaleDateString()}</h3>
        <h3>Created By: {task.creator.email} </h3>
      </div>
      { userId === task.creator._id && (
        <div>
          <p>You are the owner of the task</p>
          <button className='btn' onClick={() => onDelete(task._id)}>Delete Task</button>
          <button className='btn' onClick={() => onEdit(task._id)}>Edit Task</button>
        </div>
      )}
    </li>
  );
}

export default TaskListItem;