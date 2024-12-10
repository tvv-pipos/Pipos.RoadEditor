import { LineString } from "ol/geom";

interface LineStringResult {
    hasResult: boolean;
    distance: number;
    time: number;
    lineString: LineString; 
}

export default LineStringResult;