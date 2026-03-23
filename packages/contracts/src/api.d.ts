export interface ApiSuccess<T> {
    success: true;
    data: T;
    requestId: string;
}
export interface ApiError {
    success: false;
    code: string;
    message: string;
    requestId: string;
    details?: unknown;
}
//# sourceMappingURL=api.d.ts.map