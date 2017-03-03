import React, { PropTypes, PureComponent } from 'react';
import { Link } from 'react-router';

export default class Authentication extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      token: null
    };

    this.send = this.send.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.recover = this.recover.bind(this);
    this.verify = this.verify.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }
  componentWillMount() {
    this.props.socket.connect('/users');
  }
  componentWillUnmount() {
    this.props.socket['/users'].disconnect();
  }

  render() {
    const { props, state, login, register, recover, verify, updateEmail, updatePassword } = this;
    const { email, password } = state;
    return React.cloneElement(props.children, {
      email, password, login, register, recover, verify, updateEmail, updatePassword
    });
  }

  send(action, data, fn) {
    const send = this.props.socket['/users'].send, id = this.props.socket['/users'].id;
    return send({ type: 'method', name: 'user', action, data: { ...data, id } }, message => {
      console.log('/users acknowledgement message: ',message);
      fn(message);
    });
  }
  login(e, p) {
    const { email = e, password = p } = this.state, dispatch = this.props.dispatch;
    console.log(email, password);
    return this.send('login:email',{ email, password }, ({ data, error }) => {
      if (error) return this.setState({ error });
      const { user, token } = data;
      this.props.tokens.set('login.token', token);
      dispatch({ type: '@@user/LOGIN', user, token });
      return this.props.router.push('/account');
    });
  }
  logout() {
    return this.props.user ? this.send('logout', ({ data, error }) => {
      if (error) return this.setState({ error });
      const { user, token } = data;
      this.props.tokens.remove('login.token');
      dispatch({ type: '@@user/LOGOUT' });
      return this.props.router.push('/');
    }) : null;
  }
  register(e, p) {
    const { email = e, password = p } = this.state, dispatch = this.props.dispatch;
    console.log(email, password);
    return this.send('create',{ email, password }, ({ data, error }) => {
      if (error) return this.setState({ error });
      const { user, token } = data;
      this.props.tokens.set('login.token', token);
      dispatch({ type: '@@user/LOGIN', user, token });
      return this.router.push('/account');
    });
  }
  recover(e) {
    const { email = e } = this.state;
    console.log(email);
  }
  verify() {
    // TODO try to do this all on the backend.
    const { token } = this.state;
    console.log(token);
  }

  updateEmail(email, noop = () => undefined) {
    return this.setState({ email }, noop);
  }
  updatePassword(password, noop = () => undefined) {
    return this.setState({ password }, noop);
  }
}

export const Login = (props) => {
  const { email, password, login, updateEmail, updatePassword } = props;
  return (<section className="auth-login">
    <header>
      <h3>Log In</h3>
    </header>
    <form id="login" onSubmit={event => {
      event.preventDefault();
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      return login(email, password);
    }}>
      <div>
        <input id="email" type="email" value={email} placeholder="email"
          onChange={event => updateEmail(event.target.value)} />
      </div>
      <div>
        <input id="password" type="password" value={password} placeholder="password"
          onChange={event => updatePassword(event.target.value)} />
      </div>
      <button type="submit" >Continue</button>
    </form>
    <footer>
      <p>Forgot your password? It happens. <Link to="/triage"><u>Visit the triage.</u></Link></p>
      <p>Don't have an account? <Link to="/register"><u>Come join the family.</u></Link></p>
    </footer>
  </section>);
}

Login.propTypes = {};

export const Register = (props) => {
  const { email, password, register, updateEmail, updatePassword } = props;
  return (<section className="auth-register">
    <header>
      <h3>Sign Up</h3>
    </header>
    <form id="register" onSubmit={event => {
      event.preventDefault();
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      return register(email, password);
    }}>
      <div>
        <input id="email" type="email" value={email} placeholder="email"
          onChange={event => updateEmail(event.target.value)} />
      </div>
      <div>
        <input id="password" type="password" value={password} placeholder="password"
          onChange={event => updatePassword(event.target.value)} />
      </div>
      <button type="submit" >Continue</button>
    </form>
    <footer>
      <p>Already have an account? <Link to="/login"><u>Log in.</u></Link></p>
      <p>Forgot your password? It happens. <Link to="/triage"><u>Visit the triage.</u></Link></p>
    </footer>
  </section>);
}

Register.propTypes = {};

export const Triage = (props) => { // forgot credentials
  return (<section>
    <header>
      <h3>Triage</h3>
    </header>
    <form id="triage" onSubmit={event => {
      event.preventDefault();
      const email = document.getElementById('email');
      return props.recover(email);
    }}>
      <p>If you forgot your password, go ahead and supply your email to reset your credentials.</p>
      <input id="email" type="email" placeholder="email" />
      <button type="submit" >Send Email</button>
    </form>
    <footer>
      <p>Suddenly remembered your credentials? <Link to="/login"><u>Log in.</u></Link></p>
    </footer>
  </section>);
}
Triage.propTypes = {};

export const Recovery = (props) => {
  return null;
}
Recovery.propTypes = {};
