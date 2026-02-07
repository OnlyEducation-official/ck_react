export function GetJwt(){

    const jwt_token = localStorage.getItem("auth_token");
    const auth_user_id = localStorage.getItem("auth_user_id");

    return jwt_token
    
}