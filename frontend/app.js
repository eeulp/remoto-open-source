const apiUrl = 'http://localhost:3000/tasks';

// Fetch and display tasks on page load
window.onload = function() {
    fetchTasks();
};

function fetchTasks() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.innerHTML = `
                    <span class="${task.completed ? 'completed' : ''}">${task.description}</span>
                    <div>
                        <button onclick="toggleTask(${task.id}, ${task.completed})">${task.completed ? 'Desfazer' : 'Terminado'}</button>
                        <button onclick="deleteTask(${task.id})">Deletar</button>
                    </div>
                `;
                taskList.appendChild(taskItem);
            });
        });
}

function addTask() {
    const taskInput = document.getElementById('task-input');
    const newTask = { description: taskInput.value };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
    })
    .then(response => response.json())
    .then(() => {
        taskInput.value = '';
        fetchTasks();
    });
}

function toggleTask(id, completed) {
    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: !completed })
    })
    .then(response => response.json())
    .then(() => {
        fetchTasks();
    });
}

function deleteTask(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        fetchTasks();
    });
}
