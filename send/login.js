import React from "react";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    //console.log(this.state);
  }

  render() {
    const { username, password } = this.state;
    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <div className="header">
          <img className="WMlogo" src="/static/50x50.png" alt="logo" />
          <span className="h2">WeedPush</span>
        </div>
        <div className="input-container">
          <input
            id="email"
            type="text"
            name="username"
            className="inputLogin"
            placeholder="Username"
            aria-label="Username"
            value={username}
            onChange={this.handleChange}
          />
        </div>
        <div className="input-container">
          <input
            id="password"
            type="password"
            name="password"
            className="inputLogin"
            placeholder="Password"
            aria-label="Password"
            value={password}
            onChange={this.handleChange}
          />
        </div>
        <button type="submit" id="login-btn">
          Login
        </button>
        <blockquote hidden>
          LoginStatus: <span id="login-status">unkwon</span>
        </blockquote>
      </form>
    );
  }
}

export default Login;
