import logo from './logo.svg';
import './App.css';
import "./sass/app.scss";
import { render } from '@testing-library/react';
import { Component } from 'react';

import TopSection from "./components/top/index.jsx";
import BottomSection from "./components/bottom/index.jsx";

import axios from "axios";

const APIKEY = "a6b71a474d3049999ed172423210703";

class App extends Component{
    constructor(props){
      super(props);
        this.state = {
          cityName: "Kingston",
          numForecastDays: 3,
          isLoading: true
        };
    }

    updateWeather() {
    const {cityName, numForecastDays} = this.state;  
    const URL = `http://api.weatherapi.com/v1/forecast.json?key=${APIKEY}&q=${cityName}&days=${numForecastDays}&aqi=no&alerts=no`;  
      axios
      .get(URL)
      .then(res => {
        return res.data;
     })
      .then(data => {
        this.setState({
          isLoading: false,
          temp_c: data.current.temp_c, 
          isDay: data.current.is_day, 
          text: data.current.condition.text, 
          iconURL: data.current.condition.icon,
          forecastdays: data.forecast.forecastday
        }); 
      })
      .catch((err)=>{
        if(err)
         console.error("Cannot retrieve Weather data from the API, ",err);
      });  
    }

  componentDidMount(){
    const { eventEmitter } = this.props;

    this.updateWeather();
    
    eventEmitter.on("updateWeather", (data) => {
      this.setState({ cityName: data }, () => this.updateWeather());
    });
  }  

  render(){
    const {isLoading, cityName, temp_c, isDay, text, iconURL, forecastdays} = this.state;

    return( 
    <div className="app-container">
      <div className="main-container">
        {isLoading && <h3>Loading Weather...</h3>}
        {!isLoading &&
        <div className="top-section">
          <TopSection 
            location={cityName} 
            temp_c={temp_c} 
            isDay={isDay} 
            text={text} 
            iconURL={iconURL}
            eventEmitter={this.props.eventEmitter}
          />
        </div>
        }
        <div className="bottom-section">
          <BottomSection forecastdays={forecastdays}/>
        </div>
      </div>
    </div>
   );
  }
}

export default App;
