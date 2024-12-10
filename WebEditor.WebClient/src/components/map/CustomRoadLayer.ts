import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

function CustomRoadLayer(source: VectorSource) {
    return new VectorLayer({
        source: source,
        style: {
            'fill-color': 'rgba(255, 255, 255, 0.2)',
            'stroke-color': '#ffcc33',
            'stroke-width': 2,
            'circle-radius': 7,
            'circle-fill-color': '#ffcc33',
        },
    });
}

export default CustomRoadLayer;