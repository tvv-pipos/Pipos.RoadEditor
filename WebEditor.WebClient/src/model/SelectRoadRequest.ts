import { LineString } from "ol/geom";

interface SelectRoadRequest {
    year: number;
    lineString: LineString; 
}

export default SelectRoadRequest;