export interface SignInResponse {
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    error?: string;
}

export interface ShareTokenResponse {
    success: boolean;
    shareToken?: string;
    error?: string;
}

export interface StudentDataResponse {
    success: boolean;
    studentData?: any;
    error?: string;
}