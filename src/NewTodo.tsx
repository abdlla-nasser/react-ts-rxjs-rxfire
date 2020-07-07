import React, { useState, FormEvent } from 'react';



export const NewTodo = ({ addTodo } : { addTodo: Function }) => {
  const [newTodo, setNewTodo] = useState('')

  const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
    setNewTodo(e.currentTarget.value);
  }

  return (
    <div className="center row">
      <input required autoComplete="off" name="Add Todo" value={newTodo} onChange={(e) => handleInputChange(e)} />
      <button onClick={() => {
        addTodo(newTodo)
        setNewTodo('')
      }}>Add Todo</button>
    </div>
  )
}