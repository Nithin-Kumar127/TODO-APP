import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDesciption] = useState("");
    const [todos, setTodos] = useState([]);
    const [editId, setEditId] = useState(-1);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDesciption] = useState("");

    const apiUrl = "http://localhost:8000";

    // Add task
    const handleSubmit = () => {
        if (!title.trim() && !description.trim()) {
            toast.error("Please enter a title and description!");
            return;
        } else if (!title.trim()) {
            toast.error("Please enter a task title!");
            return;
        } else if (!description.trim()) {
            toast.error("Please enter a task description!");
            return;
        }

        fetch(apiUrl + "/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, completed: false }),
        })
        .then(res => res.json())
        .then(data => {
            setTodos([...todos, data]);
            setTitle(""); 
            setDesciption("");
            toast.success("Task added successfully!");
        })
        .catch(() => toast.error("Unable to add task"));
    };

    // Get tasks
    useEffect(() => { getItems(); }, []);

    const getItems = () => {
        fetch(apiUrl + "/todos")
        .then(res => res.json())
        .then(res => setTodos(res));
    };

    // Edit task
    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDesciption(item.description);
    };

    // Update task
    const handleUpdate = () => {
        if (!editTitle.trim() && !editDescription.trim()) {
            toast.error("Please enter a title and description!");
            return;
        } else if (!editTitle.trim()) {
            toast.error("Please enter a task title!");
            return;
        } else if (!editDescription.trim()) {
            toast.error("Please enter a task description!");
            return;
        }

        fetch(`${apiUrl}/todos/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                title: editTitle, 
                description: editDescription, 
                completed: todos.find(t => t._id === editId).completed 
            })
        })
        .then(res => res.json())
        .then(updatedItem => {
            setTodos(todos.map(t => t._id === updatedItem._id ? updatedItem : t));
            setEditId(-1);
            setEditTitle(""); 
            setEditDesciption("");
            toast.success("Task updated successfully!");
        })
        .catch(() => toast.error("Unable to update task"));
    };

    const handleEditCancel = () => setEditId(-1);

    // Delete task
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            fetch(`${apiUrl}/todos/${id}`, { method: "DELETE" })
            .then(() => {
                setTodos(todos.filter(t => t._id !== id));
                toast.success("Task deleted successfully!");
            })
            .catch(() => toast.error("Unable to delete task"));
        }
    };

    // Toggle completed
    const handleToggleCompleted = (item) => {
        fetch(`${apiUrl}/todos/${item._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                title: item.title, 
                description: item.description, 
                completed: !item.completed 
            })
        })
        .then(res => res.json())
        .then(updatedItem => {
            setTodos(todos.map(t => t._id === updatedItem._id ? updatedItem : t));
            toast.info(item.completed ? "Task marked incomplete" : "Task completed!");
        })
        .catch(() => toast.error("Unable to update task status"));
    };

    return (
        <>
        <ToastContainer position="top-right" autoClose={3000} />
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            body { font-family: 'Poppins', sans-serif; background: #f5f6fa; min-height: 100vh; margin: 0; padding: 0; }
            .todo-container { max-width: 950px; margin: 40px auto; padding: 20px; }

            .header-card { background: #667eea; border-radius: 20px; padding: 40px 30px; margin-bottom: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center; color: white; }
            .header-card h1 { font-size: 3rem; margin-bottom: 10px; }
            .header-card p { font-size: 1.2rem; color: rgba(255,255,255,0.9); }

            .add-card { background: white; border-radius: 20px; padding: 30px 25px; margin-bottom: 30px; box-shadow: 0 6px 25px rgba(0,0,0,0.15); }
            .add-card h3 { font-size: 1.6rem; margin-bottom: 20px; color: #333; }
            .form-group { display: flex; gap: 15px; flex-wrap: wrap; }
            .form-control { flex: 1; padding: 12px 15px; font-size: 1rem; border: 2px solid #ddd; border-radius: 12px; transition: all 0.3s; }
            .form-control:focus { border-color: #667eea; box-shadow: 0 0 0 0.2rem rgba(102,126,234,0.2); }
            .btn-submit { background: #667eea; color: white; border: none; border-radius: 12px; padding: 12px 25px; font-size: 1rem; cursor: pointer; transition: all 0.3s; }
            .btn-submit:hover { background: #5a67d8; transform: translateY(-2px); }

            .tasks-card { background: white; border-radius: 20px; padding: 30px; box-shadow: 0 6px 25px rgba(0,0,0,0.15); }
            .tasks-card h3 { font-size: 1.6rem; margin-bottom: 20px; color: #333; }

            .task-item { display: flex; align-items: center; justify-content: space-between; padding: 20px; border-radius: 15px; margin-bottom: 15px; background: #f9f9f9; box-shadow: 0 4px 10px rgba(0,0,0,0.05); transition: all 0.3s; }
            .task-item:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.1); }

            .task-info { display: flex; align-items: center; gap: 15px; flex-grow: 1; }
            .task-title { font-weight: 600; font-size: 1.1rem; }
            .task-description { font-size: 0.95rem; color: #555; }
            .completed-task .task-title,
            .completed-task .task-description { text-decoration: line-through; color: #999; }

            .task-actions { display: flex; gap: 10px; }
            .task-actions button { padding: 8px 18px; border-radius: 10px; border: none; font-weight: 500; cursor: pointer; transition: all 0.3s; }
            .btn-edit { background: #f093fb; color: white; }
            .btn-edit:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(240,147,251,0.3); }
            .btn-delete { background: #fa709a; color: white; }
            .btn-delete:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(250,112,154,0.3); }
            .btn-update { background: #4facfe; color: white; }
            .btn-update:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(79,172,254,0.3); }
            .btn-cancel { background: #a8edea; color: #333; }
            .btn-cancel:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(168,237,234,0.3); }

            input[type="checkbox"] { width: 20px; height: 20px; cursor: pointer; }
            .empty-state { text-align: center; padding: 40px 20px; color: #aaa; }
            .empty-state-icon { font-size: 3rem; margin-bottom: 15px; }
        `}</style>

        <div className="todo-container">
            <div className="header-card">
                <h1>✨ Todo Manager</h1>
                <p>Organize your tasks beautifully</p>
            </div>

            <div className="add-card">
                <h3>➕ Add New Task</h3>
                <div className="form-group">
                    <input placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} className="form-control" />
                    <input placeholder="Task description" value={description} onChange={e => setDesciption(e.target.value)} className="form-control" />
                    <button className="btn-submit" onClick={handleSubmit}>Add Task</button>
                </div>
            </div>

            <div className="tasks-card">
                <h3>📋 Your Tasks ({todos.length})</h3>
                {todos.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📝</div>
                        <div>No tasks yet. Add your first task above!</div>
                    </div>
                ) : todos.map(item => (
                    <div key={item._id} className="task-item">
                        <div className="task-info">
                            <input type="checkbox" checked={item.completed} onChange={() => handleToggleCompleted(item)} />
                            <div className={item.completed ? "completed-task" : ""}>
                                {editId === item._id ? (
                                    <>
                                        <input className="form-control" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                                        <input className="form-control" value={editDescription} onChange={e => setEditDesciption(e.target.value)} />
                                    </>
                                ) : (
                                    <>
                                        <div className="task-title">{item.title}</div>
                                        <div className="task-description">{item.description}</div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="task-actions">
                            {editId === item._id ? (
                                <>
                                    <button className="btn-update" onClick={handleUpdate}>Save</button>
                                    <button className="btn-cancel" onClick={handleEditCancel}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button className="btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                                    <button className="btn-delete" onClick={() => handleDelete(item._id)}>Delete</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}
