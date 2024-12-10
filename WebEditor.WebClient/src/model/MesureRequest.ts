interface MesureRequest {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  year: number;
  includeConnectionDistance: boolean;
  allowBidirectionalTravel: boolean;
  maxConnectionDistance: number;
  connectionSpeed: number;
}

export default MesureRequest;