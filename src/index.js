import React, { Component } from "react"; 
import { render } from "react-dom";
import axios from "axios";

export class App extends Component {
  state = {
    studios: [],
    isLoading: false,
    error: null
  };

  componentDidMount() {
    this.setState({ isLoading: true });

    axios
      .get("https://5aa59009f207ec00144acd27.mockapi.io/api/v1/studios")
      .then(res => {
        this.setState({
          studios: res.data,
          isLoading: false,
        });
      })
      .catch(err => this.setState({ loading: false, error: err }));
  }

  render() {
    const { studios, isLoading, error } = this.state;

    if (isLoading) return <div className="spinner"></div>;
    if (error) return <div>{error.message}</div>;
    
    return (
      <div className="app">

            {studios.map(studio =>
              <div key={studio.id} className="studio">
                <div>{studio.name}</div>
              </div>
              )
            }

      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
