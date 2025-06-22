"use server"

interface SignInBody {
    username: string;
    password: string;
}
export const signIn = async (body: SignInBody) => {
    try {
        const res = await fetch("https://tnp-recruitment-challenge.manitvig.live/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            return { success: false, error: 'Invalid credentials' };
        }

        const data = await res.json();
        data.success = true;
        
        // console.log(data);

        return data;
    } catch (error) {
        return { success: false, error: 'An error occurred during login', data: null };
    }
}

export const getShareToken = async (accessToken: string) => {
    try {
        const res = await fetch("https://tnp-recruitment-challenge.manitvig.live/share", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (!res.ok) {
            // console.log(res);
            return { success: false, error: 'Invalid credentials' };
        }

        const data = await res.json();
        data.success = true;
        
        // console.log(data);

        return data;

    } catch (error) {
        return { success: false, error: 'An error occurred during generating share token', data: null };
    }
}

export const getStudentsData = async (shareToken: string) => {
    try {
        const res = await fetch("https://tnp-recruitment-challenge.manitvig.live/share?shareToken=" + shareToken, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            // console.log(res);
            return { success: false, error: 'Either the share token is invalid or expired' };
        }

        const data = await res.json();
        const result = {
            success: true,
            studentData: data,
        }
        
        // console.log(data);

        return result;

    } catch (error) {
        return { success: false, error: 'An error occurred during fetching students data', data: null };
    }
}