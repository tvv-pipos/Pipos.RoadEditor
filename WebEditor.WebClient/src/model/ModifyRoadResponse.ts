import { LineString } from "ol/geom";
import SelectEdgeResponse from "./SelectEdgeResponse";

interface ModifyRoadResponse {
    hasResult: boolean;
    start: SelectEdgeResponse;
    lineString: LineString;
}

export default ModifyRoadResponse;