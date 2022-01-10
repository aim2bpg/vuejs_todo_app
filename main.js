const STORAGE_KEY = 'todos-vuejs'
const todoStorage = {
  fetch: function () {
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function (todo, index) { todo.id = index })
    todoStorage.uid = todos.length
    return todos
  },

  save: function (todos) { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)) }
}

new Vue({
  el: '#app',

  data: {
    content: '',
    todos: [],
    current: -1,
    options: [
      { value: -1, label: 'すべて' },
      { value: 0, label: '作業中' },
      { value: 1, label: '完了' }
    ],
    editedTodo: null
  },

  computed: {
    computedTodos: function () {
      return this.todos.filter(function (el) {
        return this.current < 0 ? true : this.current === el.state
      }, this)
    },
    labels () {
      return this.options.reduce(function (afterOption, beforeOption) {
        return Object.assign(afterOption, { [beforeOption.value]: beforeOption.label })
      }, {})
    }
  },

  watch: {
    todos: {
      handler: function (todos) {
        todoStorage.save(todos)
      },
      deep: true
    }
  },

  created () {
    this.todos = todoStorage.fetch()
  },

  methods: {
    add: function () {
      const content = this.content
      if (!content.length) {
        return
      }
      this.todos.push({
        id: todoStorage.uid++,
        content: content,
        state: 0
      })
      this.content = ''
    },
    edit: function (todo) {
      this.beforeEditCache = todo.content
      this.editedTodo = todo
    },
    doneEdit: function (todo) {
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = null
      const content = todo.content.trim()
      if (content) {
        todo.content = content
      } else {
        this.remove(todo)
      }
    },
    cancelEdit: function (todo) {
      this.editedTodo = null
      todo.content = this.beforeEditCache
    },
    changeState: function (todo) {
      todo.state = todo.state ? 0 : 1
    },
    remove: function (todo) {
      const index = this.todos.indexOf(todo)
      this.todos.splice(index, 1)
    }
  },

  directives: {
    'todo-focus' (element, content) {
      if (content.value) {
        element.focus()
      }
    }
  }
})
