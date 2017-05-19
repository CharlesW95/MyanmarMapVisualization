'use strict';

if (module.hot) {
  module.hot.accept();
}

import 'babel-polyfill';
import '../styles/index.scss';
import L from 'leaflet';
import geoData from '../../myanmar/admin_level_8_final.json';
import litData from '../../myanmar/final_data.json';

import MapStyle from './MapStyle';

// Initialize the map
let map = L.map('mapid').setView([20, 96], 5.5);
let popup = L.popup({
    minWidth: 300,
    maxWidth: 500,
    className: 'mapPopup'
});

// Functions to handle map clicks
const launchPopUp = (map, e, feature) => {
    const englishName = feature.properties["name:en"];
    let literacyRate = litData[englishName]["Literacy Rate"];
    literacyRate = Math.round(literacyRate *= 100);
    const population = litData[englishName]["Population"];
    popup
        .setLatLng(e.latlng)
        .setContent(`
            ${feature.name} | ${englishName} \
            Population: ${population} \
            Literacy Rate: ${literacyRate}%
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

const colorFeature = (feature, layer) => {
    const englishName = feature.properties["name:en"];
    const literacyRate = litData[englishName]["Literacy Rate"];
    layer.setStyle({
        fillColor: `rgba(18, 113, 166, ${literacyRate})`,
        fillOpacity: 1
    });
};

const configureIndividualFeature = (feature, layer) => {
    attachPopupToFeature(feature, layer);
    colorFeature(feature, layer);
};

// Create features
let featureLayer = L.geoJSON(geoData.features,
    {
        style: MapStyle,
        onEachFeature: configureIndividualFeature,
        weight: 0.5
    }
).addTo(map);
