// Task management
class TodoList {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.setupEventListeners();
        this.renderTasks();
    }

    setupEventListeners() {
        // Add task
        document.getElementById('addTask').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderTasks();
            });
        });
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const text = input.value.trim();
        
        if (text) {
            const task = {
                id: Date.now(),
                text: text,
                completed: false,
                priority: this.analyzePriority(text)
            };

            this.tasks.push(task);
            this.saveTasks();
            this.renderTasks();
            input.value = '';
            this.updatePriorityMessage(task);
        }
    }

    analyzePriority(text) {
        const priorityKeywords = {
            high: ['urgent', 'asap', 'important', 'critical', 'priority', 'today', 'now'],
            medium: ['tomorrow', 'soon', 'next', 'this week'],
            low: ['later', 'sometime', 'eventually', 'when possible']
        };

        text = text.toLowerCase();
        
        if (priorityKeywords.high.some(keyword => text.includes(keyword))) {
            return 'high';
        } else if (priorityKeywords.medium.some(keyword => text.includes(keyword))) {
            return 'medium';
        } else {
            return 'low';
        }
    }

    updatePriorityMessage(task) {
        const messageElement = document.getElementById('priorityMessage');
        let message = '';

        switch(task.priority) {
            case 'high':
                message = '🔴 This task has been marked as high priority!';
                break;
            case 'medium':
                message = '🟡 This task has been marked as medium priority.';
                break;
            case 'low':
                message = '🟢 This task has been marked as low priority.';
                break;
        }

        messageElement.textContent = message;
        setTimeout(() => {
            messageElement.textContent = '';
        }, 3000);
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    editTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            const newText = prompt('Edit task:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                task.priority = this.analyzePriority(newText);
                this.saveTasks();
                this.renderTasks();
            }
        }
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        let filteredTasks = this.tasks;

        switch(this.currentFilter) {
            case 'active':
                filteredTasks = this.tasks.filter(task => !task.completed);
                break;
            case 'completed':
                filteredTasks = this.tasks.filter(task => task.completed);
                break;
            case 'priority':
                filteredTasks = this.tasks.filter(task => task.priority === 'high');
                break;
        }

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''} ${task.priority === 'high' ? 'priority' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <div class="task-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            const checkbox = li.querySelector('.task-checkbox');
            const editBtn = li.querySelector('.edit-btn');
            const deleteBtn = li.querySelector('.delete-btn');

            checkbox.addEventListener('change', () => this.toggleTask(task.id));
            editBtn.addEventListener('click', () => this.editTask(task.id));
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

            taskList.appendChild(li);
        });
    }
}

// Initialize the app
const todoList = new TodoList(); 