const express = require('express');
const cors = require('cors');
const { port } = require('./config');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todo');
const networkRoutes = require('./routes/network');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/network',networkRoutes);

app.listen(port, () => {

   console.log(`Express server running on port ${port}`);
  console.log(`Hasura endpoint: ${process.env.HASURA_ENDPOINT}`);
});