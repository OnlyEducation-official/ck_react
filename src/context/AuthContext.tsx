import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { toastResponse } from "@/util/toastResponse";
import { toast } from "react-toastify";

interface User {
  id: number;
  email: string;
  firstname: string;
  lastname?: string;
}

interface JwtPayload {
  exp: number;
}

interface AuthContextType {
  user: String | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => false,
  logout: () => { },
});

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<String | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // -------------------------------------------
  // 🔍 Check if token is expired
  // -------------------------------------------
  function getTokenExpiryInfo(exp: number) {
    const expiryDate = new Date(exp * 1000);
    const now = new Date();
    const diffMs = expiryDate.getTime() - now.getTime();

    return {
      expiresAt: expiryDate.toLocaleString(),
      expired: diffMs <= 0,
      minutesLeft: Math.floor(diffMs / 1000 / 60),
      hoursLeft: (diffMs / (1000 * 60 * 60)).toFixed(2),
    };
  }
  const isTokenExpired = (jwt: string) => {
    try {
      const decoded = jwtDecode<JwtPayload>(jwt);
      const tokenExpiryInfo = getTokenExpiryInfo(
        decoded.exp * 1000 - Date.now()
      );
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // -------------------------------------------
  // 🔄 Load token & user from localStorage on app start
  // -------------------------------------------
  useEffect(() => {
    // const savedToken = localStorage.getItem("auth_token");
    // const savedUser = localStorage.getItem("auth_user");
    const savedToken = Cookies.get("auth_token");
    const savedUser = Cookies.get("auth_user");
    console.log("savedUser:", savedUser)
    if (savedToken) {
      if (isTokenExpired(savedToken)) {
        logout();
      } else {
        setToken(savedToken);
        if (savedUser) setUser(JSON.parse(savedUser));
      }
    }

    setLoading(false);
  }, []);

  // -------------------------------------------
  // 🔐 LOGIN FUNCTION
  // -------------------------------------------
  const login = async (email: string, password: string): Promise<boolean> => {

    try {
      const res = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: email,
          password,
        }),
      });

      const data = await res.json();

      console.log("status:", res.status);
      console.log("data:", data);

      if (!res.ok) {
        throw new Error(data?.error?.message || "Login failed");
      }

      // // ✅ Role restriction
      // if (data?.user?.role?.name !== "Test Series Teachers Authentication") {
      //   throw new Error("Access denied: Not a Test Series teacher");
      // }

      // // ✅ Store JWT only if teacher
      const jwt = data.jwt;
      const user = data.user.email;
      console.log("auth_user:", user)

      if (!jwt) {
        throw new Error("Login failed: JWT missing in response");
      }

      Cookies.set("auth_token", jwt, {
        expires: 7, // days
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("auth_user", JSON.stringify(user), {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      localStorage.setItem("auth_token", jwt);
      localStorage.setItem("auth_user", JSON.stringify(user));

      setToken(jwt);
      setUser(user);

      return true;

    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Try again.");
      return false;
    }

    // try {
    //   const response = await fetch(
    //     "https://admin.onlyeducation.co.in/admin/login",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
    //       },
    //       body: JSON.stringify({ email, password }),
    //     }
    //   );
    //   // if (!toastOk) return false;
    //   const res = await response.json();
    //   if (!response.ok) {
    //     console.error("Login failed:", res);
    //     return false;
    //   }

    //   const token = res.data.token;
    //   const user = res.data.user;

    //   // Save token + user
    // Cookies.set("auth_token", token, {
    //   expires: 7, // days
    //   secure: true,
    //   sameSite: "strict",
    // });
    // Cookies.set("auth_user", JSON.stringify(user), {
    //   expires: 7,
    //   secure: true,
    //   sameSite: "strict",
    // });
    // localStorage.setItem("auth_token", token);
    // localStorage.setItem("auth_user", JSON.stringify(user));

    // setToken(token);
    // setUser(user);

    // return true;
    // } catch (error) {
    // console.error("Login error:", error);
    // toast.error("Something went wrong. Try again.");
    // return false;
    // }
  };

  // -------------------------------------------
  // 🚪 LOGOUT FUNCTION
  // -------------------------------------------
  const logout = () => {
    // localStorage.removeItem("auth_token");
    // localStorage.removeItem("auth_user");
    Cookies.remove("auth_token");
    Cookies.remove("auth_user");
    setToken(null);
    setUser(null);

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
