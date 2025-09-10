// src/components/AddTaskForm.js

import React, { useState } from 'react';

function AddTaskForm({ onAddTask }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') return;
    // Llamamos a la función que nos pasaron desde App.js
    onAddTask(text);
    // Limpiamos el input
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="¿Qué necesitas hacer?"
      />
      <button type="submit">Añadir Tarea</button>
    </form>
  );
}

export default AddTaskForm;