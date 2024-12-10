import 'ol/ol.css';
import { Tile as TileLayer } from 'ol/layer';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { WMTS } from 'ol/source';

const wmtsSource = new WMTS({
    url: 'https://api.lantmateriet.se/open/topowebb-ccby/v1/wmts/token/b84e03e0-c917-313e-9f7d-fb5303034148/',
    layer: 'topowebb_nedtonad',
    matrixSet: '3006',
    format: 'image/png',
    projection: 'EPSG:3006',
    tileGrid: new WMTSTileGrid({
        origin: [-1200000, 8500000],
        resolutions: [
            2048,
            1024,
            512,
            256,
            128,
            64,
            32,
            16,
            8
        ],
        matrixIds: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    }),
    style: 'default',
});

const openStreetMapsSource = wmtsSource; //new OSM();

const MapLayer = new TileLayer({
    source: openStreetMapsSource,
});

export default MapLayer;