const todoService = require('../services/todos.service');


const getAllTodos = async (req, res, next) => {
    try {
        const filters = {
            status: req.query.status,
            priority: req.query.priority,
            q: req.query.q,
            page: req.query.page,
            limit: req.query.limit
        };

        const result = await todoService.getFilteredTodos(filters);

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};


const getTodoById = async (req, res, next) => {
    try {
        const todoId = req.params.id;
        const todo = await todoService.findTodoById(todoId);

        if (!todoId) {
            res.status(400).json({
                status: 'error',
                message: 'ID dyal Todo makinch sf ghayrha'
            });
        }

        if (!todo) {
            res.status(404).json({
                status: 'error',
                message: 'mal9inach had l\'Id li ktebti jib chi Id s7i7'
            });
        }
       
        res.status(200).json({
            status:'success',
            data: todo
        });
    } catch (error) {
        next(error);        
    }
};


const createTodo = async (req, res, next) => {
    try {
        const { title, priority, dueDate } = req.body;

        if (!title || title.trim() === '') {
            res.status(400).json({
                status: 'error',
                message: 'darori tkteb titre dyal todo'
            });
        }

        const newTodo = await todoService.createTodo({
            title: title.trim(),
            priority,
            dueDate
        });

        res.status(201).json({
            status: 'success',
            data: newTodo
        });
    } catch (error) {
        next(error);
    }
};


const updateTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;


        const allowedfields = ['title', 'completed', 'priority', 'dueDate'];
        const recievedFields = Object.keys(updates);

        const invalideFields = recievedFields.filter(field => !allowedfields.includes(field));
        if (invalideFields.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: `Champs non autorisees: ${invalideFields.join(', ')}`
            });
        }

         const updatedTodo = await todoService.updateTodo(id, updates);

        if (!updatedTodo) {
            return res.status(404).json({
                status: 'error',
                message: 'Todo non trouvée'
            });
        }

        res.status(200).json({
            status: 'succes',
            data: updatedTodo
        });
    } catch (error) {
        next(error);
    }
};


const deleteTodo = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedTodo = await todoService.deleteTodo(id)
        if(!deletedTodo) {
            return res.status(404).json({
                status: 'error',
                message: 'todo makinch'
            });
        }

        return res.status(204).send();
    } catch (error) {
       next(error);
    }
};


const toggleTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const toggledTodo = await todoService.toggleTodo(id);

        if (!toggledTodo) {
            return res.status(404).json({
                status: 'error',
                message: 'todo makinach'
            });
        }

        res.json({
            status: 'success',
            data: toggledTodo
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo
};