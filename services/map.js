function loadMapScenario() {
    // setting up a map, location and pushpin type variables
    var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {});
    var location = new Microsoft.Maps.Location(35.0278, -111.0222);
    var pushpin = new Microsoft.Maps.Pushpin(location, { color: 'green' });
    var zipLocation;

    //console log the pushpin location attributes
    console.log(pushpin.getLocation());

    //push the pin onto the map
    map.entities.push(pushpin);

    //the setView function is a bing maps function for setting the center of the map view
    map.setView({
        //changes the type of map
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        //sets the center
        center: new Microsoft.Maps.Location(35.027222, -111.0225),
        //sets the zoom
        zoom: 15
    });

    //onclick function for the submit button
    $("#submit").on("click", function () {

        //stops the page from refreshing
        event.preventDefault();

        //setting variables local to the on click
        var long = 0;
        var lat = 0;
        //setting a zipcode variable and setting it equal to the form value
        var zipcode = $("#zip-code-input").val();
        console.log(zipcode);

        //ajax call
        $.ajax({
            url: "https://dev.virtualearth.net/REST/v1/Locations/" + zipcode + "?&key=As-D2zgNd8Hd4X6WJXuu8iW0NwsJ8lPQzLWR2x_YtdZuCDO3Ihg8NNgnfjTTOKf9",
            method: "GET"
        }).then(function (res) {
            var coords = {
                lat: res.resourceSets[0].resources[0].point.coordinates[0],
                long: res.resourceSets[0].resources[0].point.coordinates[1]
            };

            lat = coords.lat;
            long = coords.long;

            zipLocation = new Microsoft.Maps.Location(lat, long);

            map.setView({
                //changes the type of map if not aerial view
                mapTypeId: Microsoft.Maps.MapTypeId.aerial,
                //sets the center
                center: new Microsoft.Maps.Location(lat, long),
                //sets the zoom
                zoom: 10
            });

            //troubleshooting can delete when fixed.
            console.log("logging coords for zipLocation")
            console.log("lat " + lat);
            console.log("long " + long);

            //nested ajax call to generate pushpins for local shelters
            $.ajax({
                url: "https://dev.virtualearth.net/REST/v1/LocalSearch/?query=homelessshelters&userLocation=" + lat + ",%20" + long + "&key=As-D2zgNd8Hd4X6WJXuu8iW0NwsJ8lPQzLWR2x_YtdZuCDO3Ihg8NNgnfjTTOKf9",
                method: "GET"
            }).then(function (res) {

                //logic for generating the pushpins
                for (i = 0; i < res.resourceSets[0].estimatedTotal; i++) {
                    var pinLocation = new Microsoft.Maps.Location(res.resourceSets[0].resources[i].point.coordinates[0], res.resourceSets[0].resources[i].point.coordinates[1]);

                    //Create custom Pushpin
                    var pin = new Microsoft.Maps.Pushpin(pinLocation, {
                        title: res.resourceSets[0].resources[i].name,
                        subTitle: res.resourceSets[0].resources[i].Website,
                        color: 'black'
                    });

                    //Add the pushpin to the map
                    map.entities.push(pin);
                }

            });

        });

    });

}
