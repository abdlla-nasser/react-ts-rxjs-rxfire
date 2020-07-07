import React from 'react';

export interface todo {
  text: string,
  taskId: string,
  user: string,
}

export const Todos = React.memo(
  function Todos({ todos, removeTodo }: { todos: todo[] | undefined, removeTodo: Function }){
  return (
    <>
      {todos?.map(todo => (
        <li key={todo.taskId} className="item">
          <h3>{todo.text}</h3>
          <button className="item-button" onClick={() => removeTodo(todo.taskId)}>&#x274C;</button>
        </li>
      ))}
    </>
  )
})