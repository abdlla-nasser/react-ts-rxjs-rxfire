// fireship RxFire
import * as React from 'react';
import { useState, useEffect, FormEvent } from 'react';
import firebase from './firebase';
import { authState } from 'rxfire/auth';
import { collectionData } from 'rxfire/firestore';
import { switchMap, tap } from 'rxjs/operators';
import './App.css';
import { isNull } from 'util';


const App: React.FC = () => {
  const [newTodo, setNewTodo] = useState('')
  const [todos, setTodos] = useState<any[]>();
  const [user, setUser] = useState<firebase.User>();
  const [error, setError] = useState('');
  const ref = firebase.firestore().collection('todos');
  const authState$ = authState(firebase.auth())
  const sub = authState$.pipe(
    tap(u => setUser(u)),
    switchMap(
      user => {
        if (!isNull(user)) {
          const query = ref.where('user', '==', user.uid)
          return collectionData(query, 'taskId');
        }
        return [];
      }
    )
  )
  useEffect(() => {
    sub.subscribe(setTodos)
    // return sub.subscribe(setTodos).unsubscribe()
  }, [sub])
  const login = () => {
    let provider = new (firebase.auth).GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }
  const logout = () => {
    firebase.auth().signOut();
  }
  const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
    setNewTodo(e.currentTarget.value);
  }
  const AddTodo = (todo: string) => {
    if (todo.length) {
      ref.add({ user: user?.uid, text: todo });
      setNewTodo('');
      setError('');
    }
    else {
      setError('Please Enter A valid string')
    }
  }
  const removeTodo = (uid: string) => {
    ref.doc(uid).delete();
  }
  return (
    <>
      <h1>trying react with ts, rxfire and firebase </h1>
      <h3>A Todo App with Authentication and Database for saving todos on the cloud</h3>
      <div className="center">
        <img src="./ultimate design tool canva.png" alt="react, typescript, rxjs and firebase logos" />
      </div>
      { user?
      <div  className="main center column">
        <h2>Hi {user?.displayName}</h2>
        {error && <h2>{error}</h2>}
        <ul className="center column">
          {todos?.map(todo => (
            <li key={todo.text} className="item">
              <h3>{todo.text}</h3>
              <button className="item-button" onClick={() => removeTodo(todo.taskId)}>&#x274C;</button>
            </li>
          ))}
        </ul>
        <div className="center row">
          <input required autoComplete="off" name="Add Todo" value={newTodo} onChange={(e) => handleInputChange(e)} />
          <button onClick={() => AddTodo(newTodo)}>Add Todo</button>
        </div>
        <button onClick={() => logout()}>Log out</button>
      </div >
      : 
      <div  className="center">
        <button onClick={() => login()}>Log In</button>
      </div>
    }
    </>
  )
};

export default App;
