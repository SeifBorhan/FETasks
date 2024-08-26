let todos = [];

function addTodo() {
    const todoInput = document.getElementById('add-todo');
    const todoPriority = document.getElementById('add-priority');
    const todoText = todoInput.value.trim();
    const todoPriorityText = todoPriority.value.trim();
    if (!todoText) {
        alert('Please enter a todo item.');
        return;
    }
    const priority = parseInt(todoPriorityText)
    if (isNaN(priority) || priority <= 0) {
        alert('Please enter a valid priority number greater than 0.');
        return;
    }
        todos.push({ text: todoText, priority:priority ,completed: false });
        todoInput.value = '';
        todoPriority.value='';
        todos.sort((a, b) => a.priority - b.priority);
        renderTodos();
    
}

function toggleComplete(index) {
    todos[index].completed = !todos[index].completed;
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

function searchTodos(status) {
    const query = document.getElementById(`search-${status}`).value.toLowerCase();
    const list = document.getElementById(`${status}-list`);
    const items = list.getElementsByTagName('li');

    for (const item of items) {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'flex' : 'none';
    }
}

function renderTodos() {
    const pendingList = document.getElementById('pending-list');
    const completedList = document.getElementById('completed-list');

    pendingList.innerHTML = '';
    completedList.innerHTML = '';

    todos.forEach((todo, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = todo.text;
        if (todo.completed) {
            listItem.classList.add('completed');
        }

        const toggleButton = document.createElement('button');
        toggleButton.textContent = todo.completed ? 'Undo' : 'Complete';
        toggleButton.onclick = () => toggleComplete(index);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTodo(index);

        listItem.appendChild(toggleButton);
        listItem.appendChild(deleteButton);

        if (todo.completed) {
            completedList.appendChild(listItem);
        } else {
            pendingList.appendChild(listItem);
        }
    });
}
