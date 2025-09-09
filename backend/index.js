// backend/index.js

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'tu-secreto-super-secreto-cambialo-despues';

// Middleware
app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
  res.send('pong');
});

const dbPath = './db.json';



// --- Funciones para leer/escribir en la DB (sin cambios) ---

// (Puedes copiar y pegar las funciones enteras de tu archivo anterior si quieres)
const readDatabase = (callback) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return callback(err);
    callback(null, JSON.parse(data));
  });
};
const writeDatabase = (data, callback) => {
  fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8', (err) => {
    if (err) return callback(err);
    callback(null);
  });
};


// --- Rutas de Autenticación (sin cambios) ---

// (Puedes copiar y pegar las rutas enteras de tu archivo anterior)
app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { return res.status(400).send('Email y contraseña son requeridos.'); }
  readDatabase((err, data) => {
    if (err) return res.status(500).send('Error del servidor.');
    if (data.users.find(u => u.email === email)) { return res.status(400).send('El email ya está registrado.'); }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { id: Date.now(), email: email, password: hashedPassword };
    data.users.push(newUser);
    writeDatabase(data, (err) => {
      if (err) return res.status(500).send('Error al guardar el usuario.');
      res.status(201).send('Usuario registrado exitosamente.');
    });
  });
});
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  readDatabase((err, data) => {
    if (err) return res.status(500).send('Error del servidor.');
    const user = data.users.find(u => u.email === email);
    if (!user) { return res.status(400).send('Credenciales inválidas.'); }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) { return res.status(400).send('Credenciales inválidas.'); }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});


// --- NUEVO: MIDDLEWARE DE AUTENTICACIÓN ---
// Este es nuestro "guardia de seguridad"
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (token == null) return res.sendStatus(401); // No hay token, no autorizado

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // El token no es válido
    req.user = user; // Guardamos los datos del usuario en el objeto de la petición
    next(); // Continuamos a la ruta solicitada
  });
}

// --- RUTAS DE TAREAS PROTEGIDAS ---

// GET: Obtener solo las tareas del usuario que ha iniciado sesión
app.get('/api/tasks', authenticateToken, (req, res) => {
  const userId = req.user.id;
  readDatabase((err, data) => {
    if (err) return res.status(500).send('Error del servidor.');
    const userTasks = data.tasks.filter(task => task.userId === userId);
    res.json(userTasks);
  });
});

// POST: Crear una tarea y asignarla al usuario actual
app.post('/api/tasks', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const newTask = {
    id: Date.now(),
    text: req.body.text,
    completed: false,
    userId: userId // Vinculamos la tarea al usuario
  };

  readDatabase((err, data) => {
    if (err) return res.status(500).send('Error del servidor.');
    data.tasks.push(newTask);
    writeDatabase(data, (err) => {
      if (err) return res.status(500).send('Error al guardar la tarea.');
      res.status(201).json(newTask);
    });
  });
});

// PATCH y DELETE (las dejaremos para más adelante para simplificar, si quieres añadirlas)
// backend/index.js

// ... (después de la ruta POST /api/tasks)

// DELETE: Eliminar una tarea verificando que pertenece al usuario
app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    readDatabase((err, data) => {
        if (err) return res.status(500).send('Error del servidor.');
        
        const taskIndex = data.tasks.findIndex(t => t.id === taskId && t.userId === userId);

        if (taskIndex === -1) {
            return res.status(404).send('Tarea no encontrada o no tienes permiso.');
        }

        data.tasks.splice(taskIndex, 1);

        writeDatabase(data, (err) => {
            if (err) return res.status(500).send('Error al eliminar la tarea.');
            res.status(200).send('Tarea eliminada.');
        });
    });
});

// PATCH: Marcar una tarea como completada
app.patch('/api/tasks/:id', authenticateToken, (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    readDatabase((err, data) => {
        if (err) return res.status(500).send('Error del servidor.');

        const taskIndex = data.tasks.findIndex(t => t.id === taskId && t.userId === userId);

        if (taskIndex === -1) {
            return res.status(404).send('Tarea no encontrada o no tienes permiso.');
        }

        const updatedTask = { ...data.tasks[taskIndex], completed: !data.tasks[taskIndex].completed };
        data.tasks[taskIndex] = updatedTask;

        writeDatabase(data, (err) => {
            if (err) return res.status(500).send('Error al actualizar la tarea.');
            res.status(200).json(updatedTask);
        });
    });
});


// Iniciar el servidor
// ...
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});