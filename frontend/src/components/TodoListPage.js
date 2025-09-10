// src/components/TodoListPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './TaskList'; // Reutilizamos los componentes
import AddTaskForm from './AddTaskForm';

const API_URL = 'https://recuerdatorio-de-tareas-backend.onrender.com';

function TodoListPage({ token }) {
  const [tasks, setTasks] = useState([]);

  // Objeto de configuración para las peticiones de axios
  const authHeaders = {
    headers: { 'Authorization': `Bearer ${token}` }
  };

  // Cargar las tareas del usuario al iniciar
  useEffect(() => {
    if (token) {
      axios.get(`${API_URL}/tasks`, authHeaders)
        .then(response => {
          setTasks(response.data);
        })
        .catch(error => console.error("Error al obtener tareas:", error));
    }
  }, [token]);

  // Añadir una nueva tarea
  const handleAddTask = (text) => {
    axios.post(`${API_URL}/tasks`, { text }, authHeaders)
      .then(response => {
        setTasks([...tasks, response.data]);
      })
      .catch(error => console.error("Error al añadir tarea:", error));
  };

  // --- FUNCIÓN DE ELIMINAR (CORREGIDA) ---
  const handleDeleteTask = (taskId) => {
    axios.delete(`${API_URL}/tasks/${taskId}`, authHeaders)
      .then(() => {
        // Filtramos la lista para quitar la tarea eliminada
        setTasks(tasks.filter(task => task.id !== taskId));
      })
      .catch(error => console.error("Error al eliminar la tarea:", error));
  };

  // --- FUNCIÓN DE MARCAR COMO COMPLETADA (CORREGIDA) ---
  const handleToggleComplete = (taskId) => {
    axios.patch(`${API_URL}/tasks/${taskId}`, {}, authHeaders) // No necesita body, solo la URL
      .then(response => {
        // Actualizamos solo la tarea que cambió
        setTasks(tasks.map(task => 
          task.id === taskId ? response.data : task
        ));
      })
      .catch(error => console.error("Error al actualizar la tarea:", error));
  };

  return (
    <div>
      <h1>Mi Lista de Tareas</h1>
      <AddTaskForm onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onDelete={handleDeleteTask}
        onToggle={handleToggleComplete}
      />
    </div>
  );
}

export default TodoListPage;