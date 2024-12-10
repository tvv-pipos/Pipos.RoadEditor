import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

function SelectedRouteLayer(source: VectorSource) {
    return new VectorLayer({
        source: source,
    });
}

export default SelectedRouteLayer;