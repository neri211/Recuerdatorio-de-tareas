// src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setToken }) { // Recibimos la función para actualizar el token en App.js
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 // src/components/Login.js

// ...
const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('https://recuerdatorio-de-tareas-backend.onrender.com', { email, password });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      // La línea navigate('/'); se ha eliminado de aquí.
    } catch (err) {
      setError('Credenciales inválidas.');
    }
  };
// ...
  // src/components/Login.js

// ... (código anterior)

  return (
    <div>
      <h2>Iniciar Sesión</h2>
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
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;