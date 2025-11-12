const fs = require('fs/promises');
const path = require('path');
const dataPath = path.join(__dirname, '../data/todos.json');

const readTodos = async () => {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
        return [];
        }
        throw error;
    }
};


const writeTodos = async (todos) => {
    await fs.writeFile(dataPath, JSON.stringify(todos, null, 2), 'utf-8');
};



const findTodoById = async (id) => {
    const todos = await readTodos();
    return todos.find(todo => todo.id == id);
};


const getFilteredTodos = async (filters = {}) => {
    let todos = await readTodos();

    const {status, priority, q, page = 1, limit = 10} = filters;

    if (status === 'active') {
        todos = todos.filter(todo => !todo.completed);
    } else if (status === 'completed') {
        todos = todos.filter(todo => todo.completed);
    }

    if (priority) {
        todos = todos.filter(todo => todo.priority === priority);
    }

    if (q) {
        const searchTerm = q.toLowerCase();
        todos = todos.filter(todo => todo.title.toLowerCase().includes(searchTerm));
    }

    todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTodos = todos.slice(startIndex, endIndex);

    return {
            data: paginatedTodos,
            currentPage: page,
            totalPages: Math.ceil(todos.length / limit),
            totalTodos: todos.length,
            hasNext: endIndex < todos.length,
            hasPrev: startIndex > 0
        };
};


const createTodo = async (todoData) => {
    const todos = await readTodos();

    const newId = todos.length > 0
    ? Math.max(...todos.map(t => t.id)) + 1 : 1;

    const newTodo = {
        id: newId,
        title: todoData.title,
        completed: false,
        priority: todoData.priority || 'medium',
        dueDate: todoData.dueDate || null,
        createdAt: new Date().toISOString
    };

    todos.push(newTodo);
    await writeTodos(todos);

    return newTodo;
};


const updateTodo = async (id, updates) => {
    const todos = await readTodos();
    const index = todos.findIndex(todo => todo.id == id);

    if (index === -1) {
        return null;
    }

    todos[index] = {
        ...todos[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };

    await writeTodos(todos);

    return todos[index];
};


const deleteTodo = async (id) => { 
    const todos = await readTodos();
    const todoIndex = todos.findIndex(todo => todo.id == id);

    if (todoIndex === -1) {
        return null;
    }


    const deletedTodo = todos.splice(todoIndex, 1)[0];
    await writeTodos(todos);

    return deletedTodo;
};

const toggleTodo = async (id) => {
    const todos = await readTodos();
    const todoIndex = todos.findIndex(todo => todo.id == id);

    if (todoIndex === -1) {
        return null;
    }

    todos[todoIndex].completed = !todos[todoIndex].completed;
    todos[todoIndex].updatedAt = new Date().toISOString();

    await writeTodos(todos);
    return todos[todoIndex];
};


module.exports = {
    readTodos,
    writeTodos,
    findTodoById,
    getFilteredTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo
};