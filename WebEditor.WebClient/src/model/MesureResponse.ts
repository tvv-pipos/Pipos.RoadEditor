import LineStringResult from "./LineStringResult";

interface MesureResponse {
    hasResult: boolean;
    shortest: LineStringResult;
    fastest: LineStringResult;
}

export default MesureResponse;