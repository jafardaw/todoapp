// عناصر HTML
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const completedCount = document.getElementById('completedCount');
const totalCount = document.getElementById('totalCount');
const filterBtns = document.querySelectorAll('.filter-btn');

// مصفوفة المهام
let todos = [];
let currentFilter = 'all'; // all, completed, pending// تحميل المهام من Local Storage
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
    renderTodos();
}
// حفظ المهام في Local Storage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}// إضافة مهمة جديدة
function addTodo() {
    const todoText = todoInput.value.trim();
    
    if (todoText === '') {
        alert('الرجاء إدخال نص المهمة');
        return;
    }
    
    const newTodo = {
        id: Date.now(), // معرف فريد
        text: todoText,
        completed: false
    };
    
    todos.push(newTodo);
    saveTodos();
    renderTodos();
    
    // تفريغ الحقل
    todoInput.value = '';
}// عرض المهام
function renderTodos() {
    // تصفية المهام حسب currentFilter
    let filteredTodos = todos;
    
    if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    } else if (currentFilter === 'pending') {
        filteredTodos = todos.filter(todo => !todo.completed);
    }
    
    // بناء HTML
    let html = '';
    
    filteredTodos.forEach(todo => {
        html += `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn">🗑️</button>
            </li>
        `;
    });
    
    todoList.innerHTML = html;
    
    // تحديث الإحصائيات
    updateStats();
    
    // تحديث أزرار التصفية
    updateFilterButtons();
}// تحديث الإحصائيات
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    
    completedCount.textContent = completed;
    totalCount.textContent = total;
}// تحديث أزرار التصفية
function updateFilterButtons() {
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === currentFilter) {
            btn.classList.add('active');
        }
    });
}// التعامل مع النقر على زر الإضافة
addBtn.addEventListener('click', addTodo);

// التعامل مع Enter في حقل الإدخال
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// التعامل مع النقر على القائمة (Event Delegation)
todoList.addEventListener('click', (e) => {
    const todoItem = e.target.closest('.todo-item');
    if (!todoItem) return;
    
    const todoId = parseInt(todoItem.dataset.id);
    const todo = todos.find(t => t.id === todoId);
    
    // إذا ضغط على الشيك بوكس
    if (e.target.classList.contains('todo-checkbox')) {
        todo.completed = e.target.checked;
        saveTodos();
        renderTodos();
    }
    
    // إذا ضغط على زر الحذف
    if (e.target.classList.contains('delete-btn')) {
        todos = todos.filter(t => t.id !== todoId);
        saveTodos();
        renderTodos();
    }
});

// التعامل مع أزرار التصفية
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentFilter = e.target.dataset.filter;
        renderTodos();
    });
});