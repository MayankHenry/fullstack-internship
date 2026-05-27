const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const message = document.getElementById('message');

document.getElementById('addBtn').addEventListener('click', addTask);
document.getElementById('clearBtn').addEventListener('click', clearTasks);
taskInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        showMessage('Please enter a task before adding.');
        return;
    }

    const li = document.createElement('li');
    li.className = 'task-item';

    const taskLabel = document.createElement('span');
    taskLabel.textContent = text;
    taskLabel.addEventListener('click', function() {
        taskLabel.classList.toggle('completed');
        showMessage(taskLabel.classList.contains('completed') ? 'Task completed!' : 'Task marked active.');
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.addEventListener('click', function() {
        li.remove();
        showMessage('Task deleted.');
    });

    li.appendChild(taskLabel);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    taskInput.value = '';
    taskInput.focus();
    showMessage('Task added successfully.');
}

function clearTasks() {
    taskList.innerHTML = '';
    showMessage('All tasks cleared.');
}

function showMessage(text) {
    message.textContent = text;
}
