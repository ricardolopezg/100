'use strict'

import React, { PropTypes } from 'react'

export default function Todo (props) {
  const { todo } = props, { todos } = todo

  return (<div>
    <form id="todo">
      <input type="text" onChange={({ target }) => todo.change({ text: target.value })} value={todo.todo.text} />
      <button type="button" onClick={todo.create}>Create</button>
    </form>
    <hr width="90%" />
    <ul>{React.Children.toArray(todos.map((todo, i) => (<li>
      <p>{todo.text}<button type="button" onClick={event => props.todo.delete(i)}>Delete</button></p>
    </li>)))}</ul>
  </div>)
}

Todo.propTypes = {}
