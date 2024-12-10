import 'ol/ol.css';
import { Tile as TileLayer } from 'ol/layer';
import { XYZ } from 'ol/source';
import { TileGrid } from 'ol/tilegrid';
import { getTopLeft } from 'ol/extent';
import { SwedenExtent } from './MapUtils';

const tileGrid = new TileGrid({
    extent: SwedenExtent,
    resolutions: [
        2048,
        1024,
        512,
        256,
        128,
        64,
        32,
        16,
        8,
        4,
        2
    ],
    tileSize: [256, 256],
    origin: getTopLeft(SwedenExtent)
});

const defaultSource = new XYZ({
    url: `/api/RoadTile/{z}/{x}/{y}/2024.png`,
    projection: 'EPSG:3006',
    tileGrid: tileGrid
})

const RoadLayer = new TileLayer({
    source: defaultSource,
    maxResolution: 64
});

const updateRoadSource = (year: number) => {
    RoadLayer.setSource(new XYZ({
        url: `/api/RoadTile/{z}/{x}/{y}/${year}.png`,
        projection: 'EPSG:3006',
        tileGrid: tileGrid
    }));
};

export { RoadLayer, updateRoadSource };