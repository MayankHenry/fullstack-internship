const tasks = [];

function addTask(task) {
    if (!task || !task.trim()) {
        alert('Please enter a valid task.');
        return;
    }
    tasks.push({ text: task.trim(), completed: false });
    document.getElementById('taskInput').value = '';
    showTasks();
}

function showTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    if (tasks.length === 0) {
        list.innerHTML = '<div class="empty-state">No tasks yet. Add a task to get started.</div>';
        return;
    }

    tasks.forEach((task, index) => {
        const item = document.createElement('div');
        item.className = 'task-item';

        const text = document.createElement('div');
        text.className = 'task-text' + (task.completed ? ' completed' : '');
        text.textContent = `${index + 1}. ${task.text}`;

        const buttons = document.createElement('div');
        buttons.className = 'task-buttons';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
        completeBtn.onclick = () => toggleCompleteTask(index);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteTask(index);

        buttons.appendChild(completeBtn);
        buttons.appendChild(deleteBtn);
        item.appendChild(text);
        item.appendChild(buttons);
        list.appendChild(item);
    });
}

function deleteTask(index) {
    if (index >= 0 && index < tasks.length) {
        tasks.splice(index, 1);
        showTasks();
    }
}

function toggleCompleteTask(index) {
    if (index >= 0 && index < tasks.length) {
        tasks[index].completed = !tasks[index].completed;
        showTasks();
    }
}

function addTaskFromInput() {
    const taskInput = document.getElementById('taskInput');
    addTask(taskInput.value);
}

function resetTasks() {
    tasks.length = 0;
    showTasks();
}

showTasks();
