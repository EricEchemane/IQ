export function BadResponse(message: string, error: any = null) {
    return {
        message,
        success: false,
        error
    };
}
export function OkResponse(data: any) {
    return {
        success: true,
        data
    };
}