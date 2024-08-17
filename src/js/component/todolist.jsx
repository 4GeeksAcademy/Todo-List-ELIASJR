import React, { useState, useEffect } from "react";
import Modal from "./modal";

const TodoList = () => {
    const [todoArray, setTodoArray] = useState([]);
    const completeCount = todoArray.filter(todo => todo.isComplete === true).length;
    const pendingCount = todoArray.length - completeCount;
    const [formData, setFormData] = useState({ titulo: "", descripcion: "" });
    const [todoEditId, setTodoEditId] = useState(null);

    const [modalEliminar, setModalELiminar] = useState({
        isOpen: false,
        todo: {},
    })

    useEffect(() => {
        const data = window.localStorage.getItem('todoItems');
        try {
            const parsedData = JSON.parse(data);
            if (parsedData) setTodoArray(parsedData);
        } catch (error) {
            console.error("Error parsing localStorage data:", error);
        }
    }, []);

    useEffect(() => {
        const data = JSON.stringify(todoArray);
        window.localStorage.setItem('todoItems', data);
    }, [todoArray]);

    const handleChange = ({ target }) => {
        setFormData({ ...formData, [target.name]: target.value });
    };

    const addTodo = (e) => {
        e.preventDefault();
        if (todoEditId !== null) {
            const newTodoArray = [...todoArray];
            let todoIndex = newTodoArray.findIndex((todo) => todo.id === todoEditId);
            if (todoIndex >= 0) {
                newTodoArray[todoIndex].titulo = formData.titulo;
                newTodoArray[todoIndex].descripcion = formData.descripcion;
                setTodoArray(newTodoArray);
                setTodoEditId(null);
                setFormData({ titulo: "", descripcion: "" });
            }
        } else {
            if (formData.titulo !== "" && formData.descripcion !== "") {
                const todo = { ...formData, isComplete: false, id: Date.now() };
                setTodoArray([...todoArray, todo]);
                setFormData({ titulo: "", descripcion: "" });
            }
        }
    };

    const deleteTodo = (id) => {
        const newTodos = todoArray.filter(todo => todo.id !== id);
        setTodoArray(newTodos);
        setModalELiminar({isOpen: false, todo: {}})
    };

    const toggleTodo = (id) => {
        const newTodoArray = [...todoArray];
        let todoIndex = newTodoArray.findIndex((todo) => todo.id === id);
        if (todoIndex >= 0) {
            newTodoArray[todoIndex].isComplete = !newTodoArray[todoIndex].isComplete;
            setTodoArray(newTodoArray);
        }
    };

    const deleteAllComplete = () => {
        const newTodoArray = todoArray.filter(todo => todo.isComplete === false);
        setTodoArray(newTodoArray);
    };

    const setTodoEdit = (id) => {
        const todo = todoArray.find((todo) => todo.id === id);
        if (todo) {
            setFormData({ titulo: todo.titulo, descripcion: todo.descripcion });
            setTodoEditId(id);
        }
    };

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
                    <button className="btn btn-danger" onClick={deleteAllComplete}>Eliminar tareas completadas</button>
                </div>
                <div className="list-group mt-3">
                    {todoArray.map((todo) =>
                        <div key={todo.id} className={`list-group-item d-flex align-items-center ${todo.isComplete ? 'text-decoration-line-through' : ''}`}>
                            <input type="checkbox" className="form-check-input mx-2" checked={todo.isComplete} onChange={() => toggleTodo(todo.id)} />
                            <p className="p-0 m-0 flex-grow-1">
                                {todo.titulo}<br />
                                <span className="text-muted">{todo.descripcion}</span>
                            </p>
                            {todo.isComplete && <span className="badge bg-success">Completada</span>}
                            <button className="btn btn-warning mx-1" onClick={() => setTodoEdit(todo.id)}>Editar</button>
                            <button className="btn btn-danger mx-1" onClick={() => setModalELiminar({isOpen: true, todo: todo})}>Eliminar</button>
                        </div>
                    )}
                    <div className="list-group-item">
                        <span className="fw-light font-monospace">Total de tareas: {todoArray.length}, Completadas: {completeCount}, Pendientes: {pendingCount}</span>
                    </div>
                </div>
            </div>
            <Modal isOpen={modalEliminar.isOpen} onClose={() =>setModalELiminar({isOpen: false, todo: {}})}>
                <div className="container text-center py-5">
                    <h4>¿Deseas eliminar la tarea '{modalEliminar.todo.titulo}' ?</h4>
                    <div className="w-100 d-flex justify-content-center mt-3">
                        <div className="btn btn-danger mx-1" onClick={() => deleteTodo(modalEliminar.todo.id)}>sí, eliminar tarea</div>
                        <div className="btn btn-success mx-1" onClick={() => setModalELiminar({isOpen: false, todo: {}})}>no, cancelar</div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TodoList;
