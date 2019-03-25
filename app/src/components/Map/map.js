import React, { Component, useState } from "react";
import { ReactBingmaps } from "react-bingmaps";
import "./style.css";
import axios from "axios";


class Map extends Component {

    state = {
    pushPins:[],
    center : [],
    zipcode : ""
}
    handleFormSubmit = () => {

        axios.get("https://dev.virtualearth.net/REST/v1/Locations/" + this.zipcode + "?&key=AgEpN8zxdQ1tj8_Zhq8IcNhyvSaEaFdyZ3lEudP0YNMla8W1Q0I9KnXaGdlLAXE8")
            .then(coordres => {

                console.log(coordres.data.resourceSets[0].resources[0].geocodePoints[0].coordinates);

                this.setState({center : coordres.data.resourceSets[0].resources[0].geocodePoints[0].coordinates})

                var coordinates = coordres.data.resourceSets[0].resources[0].geocodePoints[0].coordinates[0].toString().slice(0,10)+","+coordres.data.resourceSets[0].resources[0].geocodePoints[0].coordinates[1].toString().slice(0,10)
                // add axios for lat long using zip

                axios.get("https://dev.virtualearth.net/REST/v1/LocalSearch/?query=HomelessShelter&userLocation=" + coordinates + ",16000&key=AgEpN8zxdQ1tj8_Zhq8IcNhyvSaEaFdyZ3lEudP0YNMla8W1Q0I9KnXaGdlLAXE8").then(res => {

    console.log(res)

    var results = res.data.resourceSets[0].resources;
    var resultsArray = []
    results.forEach(function (obj){
        var pushPin = {
            "location": obj.geocodePoints[0].coordinates,
            "option":{color:"blue"}
        }
        resultsArray.push(pushPin)

    })

    this.setState({ pushPins: resultsArray })
                });
            }).catch(e => console.log(e))
    }

    componentDidMount() {

    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
      };

    render() {
        return (
            <div>
                <ReactBingmaps className="searchmap" bingmapKey="AgEpN8zxdQ1tj8_Zhq8IcNhyvSaEaFdyZ3lEudP0YNMla8W1Q0I9KnXaGdlLAXE8" pushPins={this.state.pushPins} center={this.state.center}></ReactBingmaps>
                <br></br>
                <input type="text" name="zipcodesearch"
                onChange={this.handleInputChange} value={this.state.zipcodesearch}></input><br></br>
                <button onClick={() => this.handleFormSubmit()}>Search by Zip Code</button>
                {/* everything else: table, etc. */}
            </div>
        )
    }
};

export default Map;