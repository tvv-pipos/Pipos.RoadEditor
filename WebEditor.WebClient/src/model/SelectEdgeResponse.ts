import { LineString } from "ol/geom";

interface Attribute {
    class: number;
    ferry: boolean;
    forwardProhibited: boolean;
    backwardProhibited: boolean;
    motorway: boolean;
    disconnectedIsland: boolean;
};

interface SelectEdgeResponse {
    hasResult: boolean;
    distance: number;
    forwardSpeed: number;
    backwardSpeed: number;
    years: number[];
    attribute: Attribute;
    segments: LineString;
    connection: number[];
}

export default SelectEdgeResponse;