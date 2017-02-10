import React, {PropTypes} from 'react';

export const Login = (props) => {
  return (<form>
    <input placeholder="email" />
    <input placeholder="password" />
    <button type="submit" >Log In</button>
  </form>);
}

Login.propTypes = {
};

export const Register = (props) => {
  return (<form>
    <input placeholder="email" />
    <input placeholder="password" />
    <button type="submit" >Create Account</button>
  </form>);
}

Register.propTypes = {
};

export const Triage = (props) => { // forgot credentials
  return (<form>
    <input placeholder="email" />
    <button type="submit" >Send Email</button>
  </form>);
}
Triage.propTypes = {};

export const Recovery = (props) => {
  return null;
}
Recovery.propTypes = {};
