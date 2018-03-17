import React, { Component } from "react"; 
import { render } from "react-dom";
import axios from "axios";
import "antd/dist/antd.css";
import { Slider, Select } from "antd";

export class App extends Component {

    state = {
        studios: [],
        params: [],
        selectedParams: [],
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

                const params = [...new Set(res.data.reduce((acc, el) => [...acc, ...(el.params || [])], []))]

                this.setState({
                    studios: res.data,
                    isLoading: false,
                    min,
                    max,
                    from: min,
                    to: max,
                    params
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
    handleChange = value => {
        this.setState({
            selectedParams: value
        })
      }

    render() {
        const { studios, isLoading, error, params, selectedParams, min, max, from, to } = this.state;

        if (isLoading) return <div className="spinner"></div>;
        if (error) return <div>{error.message}</div>;

        const filteredStudios = studios.filter(
            studio => studio.price >= from && studio.price <= to
        ).filter(
            studio => (selectedParams.length && studio.params) ? selectedParams.every(n => studio.params.includes(n)) : true
        );
    
        return (
        <div className="app">
                <div className="select">
                    <Select mode="multiple" style={{ width: "100%" }} onChange={this.handleChange} placeholder="Умный поиск">
                        {params.map((n, i) => (
                        <Select.Option key={i} value={n}>{n}</Select.Option>
                    ))}
                    </Select>
                </div>
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
