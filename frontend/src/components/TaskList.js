// src/components/TaskList.js

import React from 'react';
import TaskItem from './TaskItem'; // Importamos el componente de un solo item

function TaskList({ tasks, onDelete, onToggle }) {
  return (
    <div className="task-list">
      <h2>Tareas Pendientes</h2>
      <ul>
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </div>
  );
}

export default TaskList;