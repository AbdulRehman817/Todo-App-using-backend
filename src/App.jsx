import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todo, setTodo] = useState([]);

  // Fetch all todos from the API
  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/alltodo");
      setTodo(response.data.todos);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add a new todo
  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Both title and description are required.");
      return;
    }
    const newTodo = { title, description };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/todo",
        newTodo
      );
      // setTodo(response.data);
      // Update state
      fetchTodos();
      setTitle(""); // Clear inputs
      setDescription("");
      fetchTodos();
    } catch (err) {
      console.error("Error creating todo:", err);
    }
  };

  // Delete a todo
  const deleteTodo = async (_id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/todo/${_id}`);
      fetchTodos(); // Remove from state
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  // Edit a todo
  const editTodo = async (_id) => {
    const updatedTitle = prompt("Enter new title");
    const updatedDescription = prompt("Enter new description");
    if (!updatedTitle || !updatedDescription) {
      alert("Both title and description are required.");
      return;
    }
    try {
      await axios.post(`http://localhost:3000/api/v1/todo/${_id}`, {
        title: updatedTitle,
        description: updatedDescription,
      });
      fetchTodos(); // Re-fetch todos to reflect changes
    } catch (err) {
      console.error("Error editing todo:", err);
    }
  };

  return (
    <>
      <div className="container">
        <h1>Todo App</h1>
        <form onSubmit={submit}>
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>

        <ul>
          {todo.map((value) => (
            <li key={value._id}>
              <div>
                <p>{value.title}</p>
                <p>{value.description}</p>
              </div>
              <div>
                <button onClick={() => editTodo(value._id)}>✏️</button>
                <button onClick={() => deleteTodo(value._id)}>🗑</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
