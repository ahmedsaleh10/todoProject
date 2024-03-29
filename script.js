fetch("https://dummyjson.com/todos")
.then(res => res.json())
.then(data =>  {
        localStorage.setItem('todos', JSON.stringify(data.todos));
        var todos = Array.from(JSON.parse(localStorage.getItem('todos'))) || []
        const nameInput = document.querySelector('#name')
        const newTodoForm = document.querySelector('#new-todo-form')
        const username = localStorage.getItem('username') || ''
        const searchInput = document.querySelector('#search')
    
        searchInput.addEventListener("input", (e) => {
            const todosArray = Array.from(JSON.parse(localStorage.getItem('todos')))
            const searchValue = e.target.value.toLowerCase()
            const filterdArray = todosArray.filter(item => item.todo.toLowerCase().includes(searchValue) )
            DisplayTodos(filterdArray)
        })
    
        nameInput.value = username;
        nameInput.addEventListener('change', e => {
            localStorage.setItem('username', e.target.value)
        })
        
        newTodoForm.addEventListener('submit', e => {
            e.preventDefault();
            const todo = {
                id : todos.length + 1,
                todo : e.target.elements.content.value,
                completed: false,
            }
            if (todo.todo){
                todos.push(todo)
                localStorage.setItem('todos',JSON.stringify(todos))
                e.target.reset(); 
            }
            else{
                alert("The todo field is empty");
            }
            DisplayTodos(todos);
        })
        DisplayTodos(todos);
    })

const DisplayTodos = (todos) => {
    const todoList = document.querySelector('#todo-list')
    todoList.innerHTML = ""
    todos.forEach( todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item')

        const label = document.createElement('label')
        const input = document.createElement('input')
        const span = document.createElement('span')
        const content = document.createElement('div')
        const actions = document.createElement('div')
        const edit = document.createElement('button')
        const deleteButton = document.createElement('button')

        input.type = 'checkbox'
        input.name='checkbox'
        input.checked = todo.completed
        span.classList.add('bubble')
        content.classList.add('todo-content')
        actions.classList.add('actions')
        edit.classList.add('edit')
        deleteButton.classList.add('delete')

        content.innerHTML = `<input type= "text" value= "${todo.todo}" name="todo-content" readonly/>`
        edit.innerHTML='Edit'
        deleteButton.innerHTML="Delete"

        label.appendChild(input)
        label.appendChild(span);
        actions.appendChild(edit)
        actions.appendChild(deleteButton)
        todoItem.appendChild(label)
        todoItem.appendChild(content)
        todoItem.appendChild(actions)
        todoList.appendChild(todoItem)

        if(todo.completed) {
            todoItem.classList.add('done')
        }

        input.addEventListener('click', e => {
            todo.completed = e.target.checked
            localStorage.setItem('todos',JSON.stringify(todos))
            if(todo.completed) {
                todoItem.classList.add('done');
            }
            else{
                todoItem.classList.remove('done');
            }
            updateTodoStatus(todo.id,todo.completed)
        })
        
        edit.addEventListener("click", ()=>{
            const input = content.querySelector('input')
            input.removeAttribute('readonly')
            input.focus()
            input.addEventListener('blur', e => {
                input.setAttribute('readonly',true)
                todo.todo=e.target.value
                localStorage.setItem('todos',JSON.stringify(todos))
                DisplayTodos(todos);
            })
        })

        deleteButton.addEventListener('click', (e) => {
            deleteTodoItem(todo.id)
        })
    })
}

async function updateTodoStatus(id, completed) {
    var todos = Array.from(JSON.parse(localStorage.getItem('todos'))) || []
    try {
      await fetch(`https://dummyjson.com/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed,
        }),
      });
      const updatedTodoList = todos.map((todo) => todo.id === id ? { ...todo, completed } : todo );
      DisplayTodos(updatedTodoList);
    } catch (error) {
      console.error("Error updating the TODO item status:", error);
    }
  }

async function deleteTodoItem(id) {
    const todos = Array.from(JSON.parse(localStorage.getItem('todos')))
    const searchInput = document.querySelector('#search')
    const searchValue =searchInput.value.toLowerCase()
    try {
      await fetch(`https://dummyjson.com/todos/${id}`, {
        method: "DELETE",
      });
      const updatedTodoList = todos.filter((todo) => todo.id !== id);
      localStorage.setItem('todos', JSON.stringify(updatedTodoList));
      if(searchValue){
        const newTodosArray = todos.filter(item => item.todo.toLowerCase().includes(searchValue) )
        DisplayTodos(newTodosArray)
    }
    else{
        DisplayTodos(updatedTodoList);
    }
    } catch (error) {
      console.error("Error deleting the TODO item:", error);
    }
  }  