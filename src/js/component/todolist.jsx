import { useState } from "react";

import React from "react";

const TodoList = () => {

    const [todoArray, setTodoArray] = useState([
        {
            titulo: "Título 1",
            descripcion: "Descripción 1",
            isComplete: false,
            id: 1
        },
        {
            titulo: "Título 2",
            descripcion: "Descripción 2",
            isComplete: true,
            id: 2
        }
    ])
    const completeCount = todoArray.filter(todo => todo.isComplete === true).length;
    const pendingCount = todoArray.length - completeCount;

    const [formData, setFormData] = useState({ titulo: "", descripcion: "" })
    
    const handleChange = ({target}) => {
        setFormData ({ ...formData, [target.name]: target.value })
    }

    const addTodo = (e) => {
        e.preventDefault();
        if (formData.titulo !== "" && formData.descripcion !== "") {
            const todo = formData;
            todo.isComplete = false;
            todo.id = todoArray.length + 1;
            
            setTodoArray([...todoArray, todo])
            setFormData({ titulo: "", descripcion: "" })
        }
    }
    
    const deleteTodo = (id) => {
        const newTodos = todoArray.filter(todo => todo.id !== id)
        setTodoArray(newTodos)
    }

    return (
        <div className="container w-75 mt-5">
            <form className="input-group shadow rounded p-3" onSubmit={addTodo}>
                <input className="form-control" type="text" name="titulo" placeholder="Título" value={formData.titulo} onChange={handleChange}/>
                <input className="form-control" type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange}/>
                <button className="btn btn-primary" type="submit">Agregar tarea</button>
            </form>
            <div className="shadow rounded p-3 mt-5 w-100">
                <div className="d-flex align-items-center justify-content-between list-group-item">
                    <h1>Todo List</h1>
                    <button className="btn btn-danger">Eliminar tareas completadas</button>
                </div>
                <div className="list-group mt-3">
                    {
                        todoArray.map((todo) => 
                            <div key={todo.id} className={`list-group-item d-flex align-items-center ${todo.isComplete ? 'text-decoration-line-through' : ''}`}>
                                <input type="checkbox" className="form-check-input mx-2" checked={todo.isComplete}/>
                                <p className="p-0 m-0 flex-grow-1">
                                    {todo.titulo}<br />
                                    <span className="text-muted">{todo.descripcion}</span>
                                </p>
                                {todo.isComplete && <span className="badge bg-success">Completada</span>}
                                <button className="btn btn-warning mx-1">Editar</button>
                                <button className="btn btn-danger mx-1" onClick={() => deleteTodo(todo.id)}>Eliminar</button>

                            </div>
                        )
                    }

                    <div className="list-group-item">
                        <span className="fw-light font-monospace">Total de tareas: {todoArray.length}, Completadas: {completeCount}, Pendientes: {pendingCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoList;
