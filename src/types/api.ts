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

export interface studentDetails {
    first_name: string;
    last_name: string;
    roll_no: string;
    email: string;
}

export interface StudentDataResponse {
    success: boolean;
    studentData?: studentDetails[];
    error?: string;
}