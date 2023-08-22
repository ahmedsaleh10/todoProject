fetch("https://dummyjson.com/todos")
.then(res => res.json())
.then(data =>  { localStorage.setItem('todos', JSON.stringify(data.todos));})
