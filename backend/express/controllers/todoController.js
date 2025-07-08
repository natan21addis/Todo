const axios = require('axios');
const { hasuraEndpoint, hasuraAdminSecret } = require('../config');

// Helper function to get headers for Hasura requests
function getHasuraHeaders(user) {
  return {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': hasuraAdminSecret,
    'x-hasura-role': 'user',
    'x-hasura-user-id': user.sub,
  };
}

// Validate required fields in request body
function validateRequestBody(body, requiredFields) {
  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return `${field} is required`;
    }
  }
  return null;
}

// Consistent error handling
function handleErrorResponse(res, error, defaultMessage) {
  console.error('Controller Error:', error);
  
  // Extract detailed error message from Hasura if available
  let errorMessage = defaultMessage;
  if (error.response?.data?.errors) {
    errorMessage = error.response.data.errors
      .map(err => err.message)
      .join('; ');
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  const statusCode = error.response?.status || 500;
  
  return res.status(statusCode).json({
    success: false,
    message: errorMessage
  });
}

const todoController = {
  // Get all todos for authenticated user
  async getTodos(req, res) {
    try {
      const response = await axios.post(
        hasuraEndpoint,
        {
          query: `
            query GetTodos($userId: uuid!) {
              todos(where: {user_id: {_eq: $userId}}) {
                id
                title
                completed
                created_at
              }
            }
          `,
          variables: { userId: req.user.sub }
        },
        { headers: getHasuraHeaders(req.user) }
      );

      // Validate response
      if (!response.data?.data?.todos) {
        return res.status(200).json({
          success: true,
          data: []
        });
      }

      return res.status(200).json({
        success: true,
        data: response.data.data.todos
      });

    } catch (error) {
      return handleErrorResponse(res, error, 'Failed to fetch todos');
    }
  },

  // Create new todo
  async addTodo(req, res) {
    const validationError = validateRequestBody(req.body, ['title']);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    try {
      const { title } = req.body;
      
      const response = await axios.post(
        hasuraEndpoint,
        {
          query: `
            mutation AddTodo($title: String!) {
              insert_todos_one(object: {
                title: $title
              }) {
                id
                title
                completed
                created_at
              }
            }
          `,
          variables: { title }
        },
        { headers: getHasuraHeaders(req.user) }
      );

console.log("******************",response,"****************")
console.log("??????????????",response.data?.errors,"?????????????????")

      // Validate response
      if (!response.data?.data?.insert_todos_one) {
        throw new Error('Todo creation failed - no data returned');
      }

      return res.status(201).json({
        success: true,
        data: response.data.data.insert_todos_one
      });

    } catch (error) {
      return handleErrorResponse(res, error, 'Failed to create todo');
    }
  },

  // Update existing todo
  async updateTodo(req, res) {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Todo ID is required'
      });
    }

    const { title, completed } = req.body;
    
    if (title === undefined && completed === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Provide title or completed status to update'
      });
    }

    try {
      const response = await axios.post(
        hasuraEndpoint,
        {
          query: `
            mutation UpdateTodo($id: Int!, $title: String, $completed: Boolean) {
              update_todos_by_pk(
                pk_columns: {id: $id},
                _set: {
                  ${title !== undefined ? 'title: $title,' : ''}
                  ${completed !== undefined ? 'completed: $completed' : ''}
                }
              ) {
                id
                title
                completed
                created_at
              }
            }
          `,
          variables: {
            id: parseInt(id, 10),
            ...(title !== undefined && { title }),
            ...(completed !== undefined && { completed })
          }
        },
        { headers: getHasuraHeaders(req.user) }
      );

      // Check if update was successful
      if (!response.data?.data?.update_todos_by_pk) {
        return res.status(404).json({
          success: false,
          message: 'Todo not found or access denied'
        });
      }

      return res.status(200).json({
        success: true,
        data: response.data.data.update_todos_by_pk
      });

    } catch (error) {
      return handleErrorResponse(res, error, 'Failed to update todo');
    }
  },

  // Delete todo
  async deleteTodo(req, res) {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Todo ID is required'
      });
    }

    try {
      const response = await axios.post(
        hasuraEndpoint,
        {
          query: `
            mutation DeleteTodo($id: Int!) {
              delete_todos_by_pk(id: $id) {
                id
              }
            }
          `,
          variables: { 
            id: parseInt(id, 10)
          }
        },
        { headers: getHasuraHeaders(req.user) }
      );

      // Check if deletion was successful
      if (!response.data?.data?.delete_todos_by_pk) {
        return res.status(404).json({
          success: false,
          message: 'Todo not found or access denied'
        });
      }

      return res.status(200).json({
        success: true,
        data: { id: parseInt(id, 10) }
      });

    } catch (error) {
      return handleErrorResponse(res, error, 'Failed to delete todo');
    }
  }
};

module.exports = todoController;