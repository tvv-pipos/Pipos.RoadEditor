import { LineString } from "ol/geom";

interface RemoveRoadResponse {
    hasResult: boolean;
    lineString: LineString;
}

export default RemoveRoadResponse;