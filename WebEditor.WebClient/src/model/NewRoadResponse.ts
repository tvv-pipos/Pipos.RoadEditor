import SelectEdgeResponse from "./SelectEdgeResponse";

interface NewRoadResponse {
    hasResult: boolean;
    start: SelectEdgeResponse;
    end: SelectEdgeResponse;
}

export default NewRoadResponse;