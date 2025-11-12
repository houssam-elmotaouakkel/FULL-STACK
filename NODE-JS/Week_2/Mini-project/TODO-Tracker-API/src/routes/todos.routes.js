const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todos.controller');


router.get('/', todoController.getAllTodos);
router.get('/:id', todoController.getTodoById);
router.post('/', todoController.createTodo);
router.patch('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);
router.patch('/:id/toggle', todoController.toggleTodo);


module.exports = router;