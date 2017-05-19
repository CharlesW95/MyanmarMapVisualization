'use strict';

if (module.hot) {
  module.hot.accept();
}

import 'babel-polyfill';
import '../styles/index.scss';
import L from 'leaflet';
import geoData from '../../myanmar/admin_level_8.json';
import litData from '../../myanmar/final_data.json';
import MapStyle from './MapStyle';

// Initialize the map
let map = L.map('mapid').setView([15, 96], 5);
let popup = L.popup({
    minWidth: 300,
    maxWidth: 500,
    className: 'mapPopup'
});

// Functions to handle map clicks
const launchPopUp = (map, e, feature) => {
    console.log("New addition");
    const englishName = feature.properties["name:en"];
    console.log(litData[englishName]["Literacy Rate"]);
    popup
        .setLatLng(e.latlng)
        .setContent(`
            ${feature.name} | ${englishName} \n
            Literacy Rate: ${litData[englishName]["Literacy Rate"]}%
        `)
        .openOn(map);
};

const createClickHandlerWithFeature = (feature) => {
    return (e) => {
        const associatedFeature = feature;
        launchPopUp(map, e, feature);
    };
};

const attachPopupToFeature = (feature, layer) => {
    layer.on('click', createClickHandlerWithFeature(feature));
};

// Create features
let featureLayer = L.geoJSON(geoData.features,
    {
        style: MapStyle,
        onEachFeature: attachPopupToFeature
    }
).addTo(map);
