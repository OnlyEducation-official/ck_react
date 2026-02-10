export function GetJwt(){
    const jwt_token = localStorage.getItem("auth_token");
    return jwt_token
}

export function GetRoleType(){
    const role_type = localStorage.getItem("role_type");
    return role_type === `"test_series_super_admin"` ? true : false
}