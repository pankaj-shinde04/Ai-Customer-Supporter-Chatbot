import { cookies } from "next/headers";
import { scalekit } from "./scalekit";

// Simple in-memory cache with 5-minute TTL
const userCache = new Map<string, { data: any; expiry: number }>();

function decodeJWT(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
    }
}

export async function getSession() {
    const session = await cookies();
    const token = session.get("access_token")?.value
    const idToken = session.get("id_token")?.value
    
    console.log("Cookies found:", { hasToken: !!token, hasIdToken: !!idToken });
    
    if(!token || !idToken) {
        console.log("Missing tokens, returning null");
        return null;
    } 
    
    try{
        // Decode JWT directly to get user info without API call
        const decoded = decodeJWT(idToken);
        if (!decoded) {
            console.log("Failed to decode token, returning null");
            return null;
        }
        
        // Create user object from decoded JWT
        const user = {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            user: {
                id: decoded.sub,
                email: decoded.email,
                name: decoded.name
            }
        };
        
        console.log("User retrieved from JWT:", user);
        return { user, result: decoded };
    } catch (error) {
        console.error("Token validation failed:", error);
        return null;
    }
}
