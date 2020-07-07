// fireship RxFire
import * as React from 'react';
import { useState, useEffect } from 'react';
import firebase from './firebase';
import { authState } from 'rxfire/auth';
import { collectionData } from 'rxfire/firestore';
import { switchMap, filter } from 'rxjs/operators';
import './App.css';
import { todo, Todos } from './Todos';
import { NewTodo } from './NewTodo';



const App: React.FC = () => {
  const [todos, setTodos] = useState<todo[]>();
  const [user, setUser] = useState<firebase.User>();
  const [error, setError] = useState('');
  const ref = firebase.firestore().collection('todos');
  const authState$ = authState(firebase.auth())
  useEffect(() => {
    authState$.subscribe(u => setUser(u))
  }, [authState$])
  useEffect(() => {
    console.log(todos);
    const samedocs = (docs: todo[]) => {
      let arr: boolean[] = []
      docs.forEach(doc => {
        todos?.forEach(todo => {
          if (todo.taskId === doc.taskId) {
            arr.push(true);
          } else arr.push(false)
        })
      })
      return arr.includes(false)
    }
    authState$.pipe(
      filter(u => u !== null),
      switchMap(
        user => {
          const query = ref.where('user', '==', user.uid)
          return collectionData<todo>(query, 'taskId');
        }
      )
    ).subscribe((docs) => {
      if (!samedocs(docs)) {
        setTodos(docs)
      } else return;
    })
  })
  const login = () => {
    let provider = new (firebase.auth).GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }
  const logout = () => {
    firebase.auth().signOut();
  }
  
  const addTodo = (todo: string) => {
    if (todo.length) {
      ref.add({ user: user?.uid, text: todo });
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
          <Todos todos={todos} removeTodo={removeTodo} />
        </ul>
        <NewTodo addTodo={addTodo}/>
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
