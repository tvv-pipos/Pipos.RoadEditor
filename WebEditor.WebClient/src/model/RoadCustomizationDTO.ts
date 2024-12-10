import { Coordinate } from "ol/coordinate";
import { RoadCustomizationType } from "./RoadCustomization";
import GeoJSON from "ol/format/GeoJSON";
import SelectEdgeResponse from "./SelectEdgeResponse";


interface NewRoadDataDTO {
    snapStart: boolean;
    snapEnd: boolean;
    name: string;
    distance: number;
    forwardSpeed: number;
    backwardSpeed: number;
    roadClass: number;
    isFerry: boolean;
    isMotorway: boolean;
    forwardProhibited: boolean;
    backwardProhibited: boolean;
}

interface ModifyRoadDataDTO {
    name: string;
    forwardSpeed: number;
    backwardSpeed: number;
    roadClass: number;
    isFerry: boolean;
    isMotorway: boolean;
    forwardProhibited: boolean;
    backwardProhibited: boolean;
}

interface RemoveRoadDataDTO {
    name: string;
}

interface RoadCustomizationStorageDTO {
    type: RoadCustomizationType;
    points: Coordinate[];
    preview: GeoJSON | null;
    startConnection: SelectEdgeResponse | null;
    endConnection: SelectEdgeResponse | null;
    data: NewRoadDataDTO | ModifyRoadDataDTO | RemoveRoadDataDTO | null;
}

interface RoadCustomizationDTO {
    type: RoadCustomizationType;
    points: Coordinate[];
    newRoad: NewRoadDataDTO | null;
    modifyRoad: ModifyRoadDataDTO | null;
    removeRoad: RemoveRoadDataDTO | null;
}

interface RoadNetworkCustomizationDTO {
    year: number;
    roadCustomizations: RoadCustomizationDTO[];
}

export type { NewRoadDataDTO, ModifyRoadDataDTO, RemoveRoadDataDTO, RoadCustomizationDTO, RoadCustomizationStorageDTO, RoadNetworkCustomizationDTO };