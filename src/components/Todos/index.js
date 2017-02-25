import React, {PropTypes} from 'react';

export default class Todos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      text: '',
      todos: []
    };

    this.Todo = this.Todo.bind(this);

    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.fetch = this.fetch.bind(this);
    this.create = this.create.bind(this);
    this.edit = this.edit.bind(this);
    this.discard = this.discard.bind(this);
  }
  componentDidMount() {
    const todos = this.init();
    console.log(todos);
  }
  componentWillUnmount() {
    this.todos.destroy();
  }

  render() {
    const { props, state, Todo } = this;
    const { connected, text, todos } = state;

    return (
      <section className="todos">
        <header>
          <h3>Todos</h3>
        </header>
        <ul>{
          todos.map(todo => <Todo key={todo._id} {...todo} />)
        }</ul>
        <hr/>
        <form id="todo-maker" onSubmit={event => event.preventDefault()}>
          <input type="text" onChange={({ target }) => this.setState({ text: target.value })} value={text} />
          <button type="button" disabled={connected ? false : true}
            onClick={event => this.create(text)}>Create</button>
        </form>
        <footer>
          <p>Count: {todos.length}</p>
          <button type="button" disabled={connected ? false : true} onClick={() => this.fetch()}>Fetch</button>
          <button type="button" onClick={(connected ? this.disconnect : this.connect)}>{connected ? 'Disconnect' : 'Connect'}</button>
        </footer>
      </section>
    );
  }

  Todo(props) {
    const { _id, text, completed, completedAt } = props;
    return (<li className="todo-item" >
      <p>{text}</p>
      <button type="button" onClick={event => this.edit(_id, { text, completed: !completed })}>{completed ? 'complete' : 'incomplete'}</button>
      <button type="button" onClick={event => this.discard(_id)}>Delete</button>
    </li>);
  }

  init() {
    if (this.todos) return this.todos;
    const todos = this.todos = this.props.app.io.todo();
    this.todoIO = todos.init(function onConnect () {
      console.log('onConnect');
    }, message => {
      console.log('onMessage: ', message);
    }, function onDisconnect () {
      console.log('onDisconnect');
    });
    return this.todoIO;
  }
  destroy() {
    if (this.todos) {
      this.todos.destroy();
      this.todos = this.todoIO = null;
    }
  }
  connect() {
    if (this.todoIO && this.todoIO.connected) return true;
    this.setState({ connected: true }, this.todos.connect);
  }
  disconnect() {
    if (this.todoIO && this.todoIO.disconnected) return true;
    this.setState({ connected: false }, this.todos.disconnect);
  }
  fetch(query) {
    if (this.todos && this.state.connected) return this.todos.fetch(query, res => {
      console.log('response: ',res);
      const todos = res.data;
      return this.setState({ todos });
    });
  }
  create(text) {
    if (this.todos && this.state.connected) return this.todos.create({ text }, res => {
      const { data } = res;
      console.log('todo created - data: ',data);
      return this.setState(state => ({
        text: '', todos: state.todos.concat(data)
      }));
    });
  }
  edit(id, { text, completed }) {
    if (this.todos && this.state.connected) return this.todos.edit({ id, text, completed }, res => {
      const { data } = res;
      return this.setState(state => ({
        todos: state.todos.map(todo => todo._id === data._id ? data : todo)
      }));
    });
  }
  discard(id) {
    if (this.todos && this.state.connected) return this.todos.delete({ id }, res => {
      const { data } = res;
      console.log('deleted response: ',res);
      return this.setState(state => ({
        todos: state.todos.filter(todo => todo._id === data._id ? false : true)
      }));
    });
  }
}

Todos.propTypes = {};
