// js/script.js
document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.getElementById('todoInput');
    const dateInput = document.getElementById('dateInput');
    const addBtn = document.getElementById('addBtn');
    const filterBtn = document.getElementById('filterBtn');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    const todoItemsContainer = document.getElementById('todoItems');
    
    let todos = [];
    
    // Load todos from localStorage if available
    if (localStorage.getItem('todos')) {
        todos = JSON.parse(localStorage.getItem('todos'));
        renderTodos();
    }
    
    // Add new todo
    addBtn.addEventListener('click', function() {
        addTodo();
    });
    
    // Add todo when Enter key is pressed
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // Filter todos
    filterBtn.addEventListener('click', function() {
        const filteredTodos = todos.filter(todo => !todo.completed);
        if (filteredTodos.length > 0) {
            renderFilteredTodos(filteredTodos);
        } else {
            showNoTasksMessage();
        }
    });
    
    // Delete all todos
    deleteAllBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete all todos?')) {
            todos = [];
            saveTodosToLocalStorage();
            renderTodos();
        }
    });
    
    // Function to add a new todo
    function addTodo() {
        const task = todoInput.value.trim();
        const dueDate = dateInput.value;
        
        // Validate input
        if (!task) {
            alert('Please enter a task!');
            return;
        }
        
        if (!dueDate) {
            alert('Please select a due date!');
            return;
        }
        
        // Create new todo object
        const newTodo = {
            id: Date.now(),
            task: task,
            dueDate: dueDate,
            completed: false
        };
        
        // Add to todos array
        todos.push(newTodo);
        
        // Save to localStorage
        saveTodosToLocalStorage();
        
        // Clear inputs
        todoInput.value = '';
        dateInput.value = '';
        
        // Render todos
        renderTodos();
    }
    
    // Function to render all todos
    function renderTodos() {
        todoItemsContainer.innerHTML = '';
        
        if (todos.length === 0) {
            showNoTasksMessage();
            return;
        }
        
        todos.forEach(todo => {
            const todoItem = createTodoElement(todo);
            todoItemsContainer.appendChild(todoItem);
        });
    }
    
    // Function to render filtered todos (only incomplete)
    function renderFilteredTodos(filteredTodos) {
        todoItemsContainer.innerHTML = '';
        
        if (filteredTodos.length === 0) {
            showNoTasksMessage();
            return;
        }
        
        filteredTodos.forEach(todo => {
            const todoItem = createTodoElement(todo);
            todoItemsContainer.appendChild(todoItem);
        });
    }
    
    // Function to create a todo element
    function createTodoElement(todo) {
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        todoItem.dataset.id = todo.id;
        
        // Format date for display
        const formattedDate = formatDate(todo.dueDate);
        
        // Create status indicator
        const statusIndicator = document.createElement('div');
        statusIndicator.className = `status-indicator ${todo.completed ? 'completed' : ''}`;
        
        // Create action buttons
        const completeBtn = document.createElement('button');
        completeBtn.className = 'action-btn complete';
        completeBtn.innerHTML = todo.completed ? '✓' : '○';
        completeBtn.title = todo.completed ? 'Mark as incomplete' : 'Mark as complete';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete';
        deleteBtn.innerHTML = '×';
        deleteBtn.title = 'Delete task';
        
        // Add event listeners to buttons
        completeBtn.addEventListener('click', function() {
            toggleComplete(todo.id);
        });
        
        deleteBtn.addEventListener('click', function() {
            deleteTodo(todo.id);
        });
        
        // Create actions container
        const actions = document.createElement('div');
        actions.className = 'actions';
        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);
        
        // Add content to todo item
        todoItem.innerHTML = `
            <div class="task-text">${todo.task}</div>
            <div class="due-date">${formattedDate}</div>
            <div class="status"></div>
        `;
        
        // Add status indicator and actions
        todoItem.querySelector('.status').appendChild(statusIndicator);
        todoItem.appendChild(actions);
        
        return todoItem;
    }
    
    // Function to toggle todo completion status
    function toggleComplete(id) {
        const todoIndex = todos.findIndex(todo => todo.id === id);
        if (todoIndex !== -1) {
            todos[todoIndex].completed = !todos[todoIndex].completed;
            saveTodosToLocalStorage();
            renderTodos();
        }
    }
    
    // Function to delete a todo
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodosToLocalStorage();
        renderTodos();
    }
    
    // Function to show "No tasks found" message
    function showNoTasksMessage() {
        todoItemsContainer.innerHTML = '<div class="no-tasks">No task found</div>';
    }
    
    // Function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }
    
    // Function to save todos to localStorage
    function saveTodosToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
});