import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    state = {
        response: '',
        post: 'Bad value',
        postUser: '',
        postP: '',
        postMsg: '',
        responseToPost: '',
    };
    componentDidMount() {
        this.callApi()
            .then(res => this.setState({ response: res.express }))
            .catch(err => console.log(err));
    }
    callApi = async () => {
        const response = await fetch('/api/hello');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };
    handleSubmit = async e => {
        e.preventDefault();
        // const response = await fetch('/api/world', {
        const response = await fetch('/okc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: this.state.post,
                postUser: this.state.postUser,
                postP: this.state.postP,
                postMsg: this.state.postMsg,
            }),
        });
        const body = await response.text();
        this.setState({ responseToPost: body });
    };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
          <p>{this.state.response}</p>
          <form onSubmit={this.handleSubmit}>
              <p>
                  <strong>Post to Server:</strong>
              </p>
              okcu: <input
                  type="text"
                  name="user"
                  value={this.state.postUser}
                  onChange={e => this.setState({ postUser: e.target.value })}
              /><br />
              p: <input
                  type="text"
                  name="pwd"
                  value={this.state.postP}
                  onChange={e => this.setState({ postP: e.target.value })}
              /><br />
              msg: <input
                  type="text"
                  name="msg"
                  value={this.state.postMsg}
                  onChange={e => this.setState({ postMsg: e.target.value })}
              /><br />
              <button type="submit">Submit</button>
          </form>
          <p>{this.state.responseToPost}</p>
      </div>
    );
  }
}

export default App;
