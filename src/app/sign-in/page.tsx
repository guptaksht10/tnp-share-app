"use client"

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { signIn } from "@/lib/api";
import CircularProgress from "@mui/material/CircularProgress";
import { SignInResponse } from "@/types/api";

interface SignInPageState {
    error: string;
    loading: boolean;
}

export default function Page() {
    const router = useRouter();
    const [state, setState] = useState<SignInPageState>({
        error: '',
        loading: false
    });
    const passwordRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);

    const handleSignIn = async (): Promise<void> => {
        if (!usernameRef.current || !passwordRef.current) {
            setState(prev => ({ ...prev, error: 'Please enter both username and password' }));
            alert('Please enter both username and password');
            return;
        }

        setState(prev => ({ ...prev, loading: true }));
        const result: SignInResponse = await signIn({
            username: usernameRef.current.value,
            password: passwordRef.current.value,
        });

        if (result.success) {
            const { accessToken, refreshToken } = result;
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("accessToken", accessToken!);
            localStorage.setItem("refreshToken", refreshToken!);
            router.push('/admin');
            return;
        }

        setState(prev => ({ ...prev, loading: false }));
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setState(prev => ({ ...prev, error: result.error || 'An error occurred during login' }));
        alert(result.error || 'An error occurred during login');
        setState(prev => ({ ...prev, loading: false }));
    };

    return (
        <div className="flex justify-center h-screen items-center">
            <div className="flex flex-col gap-4 p-8 border border-white rounded-lg">
                <div className="text-2xl font-bold flex justify-center text-blue-500">Admin Login</div>
                <div className="flex flex-col gap-2">
                    <label>Username</label>
                    <input 
                        ref={usernameRef} 
                        type="text" 
                        id="username" 
                        className="text-white border border-white rounded-lg p-2 focus:outline-none focus:border-blue-500" 
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label>Password</label>
                    <input 
                        ref={passwordRef} 
                        type="password" 
                        id="password" 
                        className="text-white border border-white rounded-lg p-2 focus:outline-none focus:border-blue-500" 
                    />
                </div>
                {state.loading ? (
                    <div className="flex justify-center items-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleSignIn}
                    >
                        Sign In
                    </Button>
                )}

            </div>
        </div>
    );
}