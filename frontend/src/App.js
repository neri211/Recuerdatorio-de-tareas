// src/App.js

// Importamos useEffect
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

import Login from './components/Login';
import Register from './components/Register';
import TodoListPage from './components/TodoListPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // --- NUEVO HOOK useEffect ---
  // Este código se ejecutará cada vez que el valor de 'token' cambie.
  useEffect(() => {
    if (token) {
      // Si hay un token (el usuario acaba de iniciar sesión),
      // lo llevamos a la página principal.
      navigate('/');
    }
  }, [token]); // El [token] significa "ejecútate cuando 'token' cambie"

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <div className="App">
      <nav>
        {token ? (
          <button onClick={handleLogout}>Cerrar Sesión</button>
        ) : (
          <>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </nav>
      
      <header className="App-header">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/" element={
            token 
              ? <TodoListPage token={token} />
              : <Login setToken={setToken} />
          } />
        </Routes>
      </header>
    </div>
  );
}

export default App;