const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTodos, addTodo, updateTodo, deleteTodo } = require('../controllers/todoController');

router.get('/', auth, getTodos);
router.post('/', auth, addTodo);
router.put('/:id', auth, updateTodo);
router.delete('/:id', auth, deleteTodo);

module.exports = router;