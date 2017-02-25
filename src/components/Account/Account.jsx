import React, { PropTypes, PureComponent } from 'react';
import { Link } from 'react-router'

export const Profile = (props) => {
  const { user } = props;
  return user && user.loggedIn ? (<section>
    <header>
      <h3>{`Email: ${user.email.address}, verified: ${user.email.verified ? true : false}.`}</h3>
    </header>
    <button type="button" onClick={event => event}>Verify Email</button>
  </section>) : (<section>
    <header><h3>Oops!</h3></header>
    <footer>
      <p>You need to be logged in to view your profile. <Link to="/login"><u>Login now.</u></Link></p>
      <p>Forgot your password? It happens. <Link to="/triage"><u>Visit the triage.</u></Link></p>
      <p>Don't have an account? <Link to="/register"><u>Come join the family.</u></Link></p>
    </footer>
  </section>);
};

export default class Account extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { user = {} } = this.props;
    return (<section>{React.cloneElement(this.props.children, {
      user
    })}</section>);
  }
}

Account.propTypes = {};
