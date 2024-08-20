const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const getTasks = () => {
    const data = fs.readFileSync('db.json', 'utf-8');
    return JSON.parse(data).tasks;
};

const saveTasks = (tasks) => {
    const data = JSON.stringify({ tasks }, null, 2);
    fs.writeFileSync('db.json', data);
};

// GET all tasks
app.get('/tasks', (req, res) => {
    const tasks = getTasks();
    res.json(tasks);
});

// POST a new task
app.post('/tasks', (req, res) => {
    const tasks = getTasks();
    const newTask = {
        id: tasks.length + 1,
        description: req.body.description,
        completed: false,
    };
    tasks.push(newTask);
    saveTasks(tasks);
    res.json(newTask);
});

// PUT update a task (mark as completed)
app.put('/tasks/:id', (req, res) => {
    const tasks = getTasks();
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        task.completed = req.body.completed;
        saveTasks(tasks);
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

// DELETE a task
app.delete('/tasks/:id', (req, res) => {
    let tasks = getTasks();
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks(tasks);
    res.json({ message: 'Task deleted' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
