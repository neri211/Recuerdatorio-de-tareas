// src/components/Register.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Hook para redirigir al usuario

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
   await axios.post('https://recuerdatorio-de-tareas-backend.onrender.com/api/auth/register', { email, password });
      navigate('/login');
    } catch (err) {
      // Si el servidor responde con un error (ej: email ya existe)
      if (err.response) {
        setError(err.response.data);
      } else {
        // Si no hay respuesta (ej: backend apagado)
        setError('No se pudo conectar al servidor. Inténtalo de nuevo.');
      }
    }
  };
 // src/components/Register.js

// ... (código anterior)

  return (
    <div>
      <h2>Registro</h2>
      {/* Añadimos la clase al formulario */}
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <button type="submit">Registrarse</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Register;
