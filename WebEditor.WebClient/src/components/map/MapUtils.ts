import { Map, View } from "ol";
import { register } from "ol/proj/proj4";
import proj4 from 'proj4';

proj4.defs(
    'EPSG:3006',
    '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs'
);
register(proj4);

export const SwedenExtent = [180296, 6106230, 1074900, 7791212];

// Centered roughly on Sweden
export const SwedenView = new View({
    projection: 'EPSG:3006',
    center: [-1200000, 8500000],
    zoom: 5,
});

// Fit the view to Sweden's extent
export function FitToSweden(map: Map) {
    map.getView().fit(SwedenExtent, {
        size: map.getSize(),
        maxZoom: 20,
    });
}

export default { SwedenExtent, SwedenView, FitToSweden };