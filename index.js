const express = require('express');
const app = express();
const path = require('path');
const pool = require('./db');

app.use(express.json()); // => req.body

//ENGINE//
//app.use(express.static(path.join(__dirname, '/public')));
app.use('/public', express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//ROUTES//
app.get('/', async (req, res) => {
	try {
		const allTodos = await pool.query('SELECT * FROM todo');
		// res.json(allTodos.rows);
		console.log(allTodos);
		res.render('index', { todos: allTodos.rows });
	} catch (err) {
		console.log(err.message);
	}
});

// get all todos
app.get('/todos', async (req, res) => {
	try {
		const allTodos = await pool.query('SELECT * FROM todo');
		res.json(allTodos.rows);
	} catch (err) {
		console.log(err.message);
	}
});

//get a todo
app.get('/todos/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1', [
			id,
		]);
		res.json(todo.rows[0]);
	} catch (err) {
		console.error(err.message);
	}
});

//create a todo
app.post('/todos', (req, res) => {
	const { description } = req.body;
	const newTodo = pool.query(
		'INSERT INTO todo (description) VALUES ($1) RETURNING *',
		[description]
	);
	res.json(newTodo);
});

//update a todo
app.post('/todos/:id', async (req, res) => {
	try {
		const { id } = req.params; // where
		const { description } = req.body; // where to set

		const updateTodo = await pool.query(
			'UPDATE todo SET description = $1 WHERE todo_id = $2',
			[description, id]
		);
		res.json('Todo was updated!');
	} catch (err) {
		console.error(err.message);
	}
});

//delete a todo
app.delete('/todos/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const deleteTodo = await pool.query('DELETE FROM todo WHERE todo_id = $1', [
			id,
		]);
		res.json('Todo was successfully deleted!');
	} catch (err) {
		console.error(err.message);
	}
});

// let completed = document.getElementById('myButton');
// completed.addEventListener('click', (evt) => {
// 	const id = evt.target.value;
// 	fetch(`localhost:3000/todos/${id}`, {
// 		method: 'DELETE',
// 	})
// 		.then((response) => response.json())
// 		.then(app.get());
// });

app.listen(3000, () => {
	console.log('server is listening on port 3000');
});
