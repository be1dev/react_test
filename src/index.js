import React, { Component } from "react"; 
import { render } from "react-dom";
import axios from "axios";
import "antd/dist/antd.css";
import { Slider } from "antd";

export class App extends Component {

  state = {
    studios: [],
    isLoading: false,
    error: null
  };

  componentDidMount() {
    this.setState({ isLoading: true });

    axios.get("https://5aa59009f207ec00144acd27.mockapi.io/api/v1/studios")
      .then(res => {

        const min = res.data.reduce(
            (acc, el) => (acc > el.price ? el.price : acc),
            Infinity
          );
        const max = res.data.reduce(
        (acc, el) => (acc < el.price ? el.price : acc),
            -Infinity
          );

          this.setState({
            studios: res.data,
            isLoading: false,
            min,
            max,
            from: min,
            to: max
          });

      })

      .catch(err => this.setState({ loading: false, error: err }));
  }

  onChange = value => {
    const [from, to] = value;

    this.setState({
      from,
      to
    });
  };

  render() {
    const { studios, isLoading, error, min, max, from, to } = this.state;

    if (isLoading) return <div className="spinner"></div>;
    if (error) return <div>{error.message}</div>;

    const filteredStudios = studios.filter(
        studio => studio.price >= from && studio.price <= to
    )
    
    return (
      <div className="app">

            <div className="slider">
                <div className="slider__container">
                  <div>Стоимость</div>
                  <div>от {from} до {to}</div>
                </div>
                <Slider range min={min} max={max} defaultValue={[1100, 2200]} onChange={this.onChange} />
            </div>

            {filteredStudios.map(studio =>
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
