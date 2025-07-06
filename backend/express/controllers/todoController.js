const axios = require('axios');
const { hasuraEndpoint, hasuraAdminSecret } = require('../config');

function getUserHeaders(user) {
  return {
    'x-hasura-admin-secret': hasuraAdminSecret,
    'x-hasura-role': 'user',
    'x-hasura-user-id': user.sub,
  };
}

async function getTodos(req, res) {
  try {
    const response = await axios.post(
      hasuraEndpoint,
      {
        query: `query GetTodos($userId: uuid!) {
          todos(where: {user_id: {_eq: $userId}}) { 
            id title completed created_at 
          }
        }`,
        variables: { userId: req.user.sub }
      },
      { headers: getUserHeaders(req.user) }
    );
    
    return res.status(200).json({
      success: true,
      message: 'Todos fetched successfully',
      data: response.data.data.todos
    });
  } catch (err) {
    console.error('Get todos error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch todos',
      error: err.response?.data?.errors?.[0]?.message || err.message
    });
  }
}

async function addTodo(req, res) {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    });
  }

  try {
    const response = await axios.post(
      hasuraEndpoint,
      {
        query: `mutation AddTodo($title: String!, $userId: uuid!) {
          insert_todos_one(object: {title: $title, user_id: $userId}) { 
            id title completed created_at 
          }
        }`,
        variables: { title, userId: req.user.sub }
      },
      { headers: getUserHeaders(req.user) }
    );

    return res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: response.data.data.insert_todos_one
    });
  } catch (err) {
    console.error('Add todo error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create todo',
      error: err.response?.data?.errors?.[0]?.message || err.message
    });
  }
}

async function updateTodo(req, res) {
  const { id } = req.params;
  const { title, completed } = req.body;

  if (!title && typeof completed !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'Provide either title or completed status to update'
    });
  }

  try {
    const response = await axios.post(
      hasuraEndpoint,
      {
        query: `mutation UpdateTodo($id: Int!, $title: String, $completed: Boolean) {
          update_todos_by_pk(
            pk_columns: {id: $id}, 
            _set: {title: $title, completed: $completed}
          ) {
            id title completed created_at
          }
        }`,
        variables: { 
          id: parseInt(id), 
          title, 
          completed 
        }
      },
      { headers: getUserHeaders(req.user) }
    );

    return res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: response.data.data.update_todos_by_pk
    });
  } catch (err) {
    console.error('Update todo error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update todo',
      error: err.response?.data?.errors?.[0]?.message || err.message
    });
  }
}

async function deleteTodo(req, res) {
  const { id } = req.params;

  try {
    await axios.post(
      hasuraEndpoint,
      {
        query: `mutation DeleteTodo($id: Int!) {
          delete_todos_by_pk(id: $id) { id }
        }`,
        variables: { id: parseInt(id) }
      },
      { headers: getUserHeaders(req.user) }
    );

    return res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: { id: parseInt(id) }
    });
  } catch (err) {
    console.error('Delete todo error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete todo',
      error: err.response?.data?.errors?.[0]?.message || err.message
    });
  }
}

module.exports = { getTodos, addTodo, updateTodo, deleteTodo };