import { cookies } from "next/headers";
import { scalekit } from "./scalekit";

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
        // Validate idToken instead (longer expiry than accessToken)
        console.log("Validating idToken...");
        const result: any = await scalekit.validateToken(idToken);
        console.log("Token validated, getting user...");
        const user: any = await scalekit.user.getUser(result.sub);
        console.log("User retrieved:", user);
        return { user, result };
    } catch (error) {
        console.error("Token validation failed:", error);
        return null;
    }
    
    
}
