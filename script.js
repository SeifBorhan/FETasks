import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEs4JhpjhjoiT8k7fRamTCZMWV7MLUoV4",
  authDomain: "task-5e5d3.firebaseapp.com",
  projectId: "task-5e5d3",
  storageBucket: "task-5e5d3.appspot.com",
  messagingSenderId: "709039291377",
  appId: "1:709039291377:web:233caeaaaae098178c2250"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Global todos state
let todos = [];

// Fetch todos from Firestore
const fetchTodos = async () => {
  try {
    const todosCol = collection(db, 'todos');
    const todosQuery = query(todosCol, orderBy('priority', 'asc'));
    const todosSnapshot = await getDocs(todosQuery);
    todos = todosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderTodos();
  } catch (error) {
    console.error('Error fetching todos:', error);
    alert('Error fetching todos.');
  }
};

const addTodoToFirestore = async (todo) => {
  try {
    await addDoc(collection(db, 'todos'), todo);
    console.log('Todo added:', todo);
    fetchTodos();
  } catch (error) {
    console.error('Error adding todo:', error);
    alert('Error adding todo. Check console for details.');
  }
};

const handleAddTodo = () => {
  const todoInput = document.getElementById('add-todo');
  const todoPriority = document.getElementById('add-priority');
  const todoText = todoInput.value.trim();
  const todoPriorityText = todoPriority.value.trim();
  
  if (!todoText) {
    alert('Please enter a todo item.');
    return;
  }
  
  const priority = parseInt(todoPriorityText);
  if (isNaN(priority) || priority <= 0) {
    alert('Please enter a valid priority number greater than 0.');
    return;
  }
  
  const newTodo = { text: todoText, priority: priority, completed: false };
  addTodoToFirestore(newTodo);

  todoInput.value = '';
  todoPriority.value = '';
};

const toggleComplete = async (index) => {
  const todo = todos[index];
  const updatedTodo = { ...todo, completed: !todo.completed };

  try {
    await updateDoc(doc(db, 'todos', todo.id), updatedTodo);
    console.log('Todo updated:', updatedTodo);
    fetchTodos();
  } catch (error) {
    console.error('Error updating todo:', error);
    alert('Error updating todo. Check console for details.');
  }
};

const deleteTodo = async (index) => {
  const todo = todos[index];
  try {
    await deleteDoc(doc(db, 'todos', todo.id));
    console.log('Todo deleted:', todo);
    fetchTodos();
  } catch (error) {
    console.error('Error deleting todo:', error);
    alert('Error deleting todo. Check console for details.');
  }
};


const renderTodos = () => {
  const pendingList = document.getElementById('pending-list');
  const completedList = document.getElementById('completed-list');

  pendingList.innerHTML = '';
  completedList.innerHTML = '';

  todos.forEach((todo, index) => {
    const listItem = document.createElement('li');
    
    const container = document.createElement('div');
    container.classList.add('todo-item-container');
    
    const textDiv = document.createElement('div');
    textDiv.textContent = todo.text;
    textDiv.classList.add('todo-text');
    
    const toggleButton = document.createElement('button');
    toggleButton.textContent = todo.completed ? 'Undo' : 'Complete';
    toggleButton.classList.add('todo-button');
    toggleButton.onclick = () => toggleComplete(index);
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('todo-button');
    deleteButton.onclick = () => deleteTodo(index);
    
    container.appendChild(textDiv);
    container.appendChild(toggleButton);
    container.appendChild(deleteButton);
    
    listItem.appendChild(container);
    
    if (todo.completed) {
      completedList.appendChild(listItem);
    } else {
      pendingList.appendChild(listItem);
    }
  });
  
};


document.getElementById('add-todo-btn').addEventListener('click', handleAddTodo);
document.getElementById('search-pending').addEventListener('input', () => searchTodos('pending'));
document.getElementById('search-completed').addEventListener('input', () => searchTodos('completed'));

fetchTodos();
