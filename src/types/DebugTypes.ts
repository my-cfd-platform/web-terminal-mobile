import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';

export interface DebugTypes {
    level: string,
    processId: string,
    message: string,
    jsonLogObject: string
}

export interface DebugResponse {
    result: OperationApiResponseCodes;
}