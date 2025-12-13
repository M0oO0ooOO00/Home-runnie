export interface ErrorData {
    errorCode: string;
    message: string;
    path: string | null;
    timestamp: string;
}

export interface ErrorResponse {
    code: number;
    data: ErrorData;
}
