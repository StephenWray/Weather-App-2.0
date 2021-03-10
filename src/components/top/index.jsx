import React from "react";

import "./style.scss";
import Weather from "./weather";

import {Manager, Reference, Popper} from 'react-popper';

export default class TopSection extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isSelectionLocationOpen: false,
        };    
    }

    onToggleSelectionLocation(){
        this.setState((prevState) => ({ 
            isSelectionLocationOpen: !prevState.isSelectionLocationOpen 
        }));
    }

    onLocationNameChange (e){
        this.setState({ locationName: e.target.value });
    }

    onSelectCity (){
        const { locationName } = this.state;
        const { eventEmitter } = this.props;
        eventEmitter.emit("updateWeather", locationName);
        this.setState({ isSelectionLocationOpen: false });
    }

    render(){
        const { isSelectionLocationOpen } = this.state;
        const { eventEmitter } = this.props;

        return <div className="top-container">
            <div className="title">Weather Forecast</div>
            <Weather {...this.props}/>
                <Manager>
                    <Reference>
                        {({ ref }) => (
                            <button className="btn btn-select-location" 
                                ref={ref} 
                                onClick={this.onToggleSelectionLocation.bind(this)}
                            >
                                Select Location
                            </button>
                        )}
                    </Reference>
                    <Popper placement="bottom">
                        {({ ref, style, placement, arrowProps }) => ( 
                            isSelectionLocationOpen &&
                            <div className="popup-container" ref={ref} style={style} data-placement={placement}>
                                <div className="form-container">
                                    <label htmlFor="location-name">Location Name</label>
                                        <input id="location-name" 
                                        type="text" 
                                        placeholder="City Name"
                                        onChange={this.onLocationNameChange.bind(this)}
                                    />
                                    <button className="btn btn-select-location" onClick={this.onSelectCity.bind(this)}>Select</button>
                                </div>
                                <div ref={arrowProps.ref} style={arrowProps.style}/>
                            </div>
                        )}
                    </Popper>
                </Manager>
        </div>
    }
}