import { useCallback } from "react";
import { API_BASE_URL } from "@/utils";
import { useRouter } from "next/router";

interface LoginFormData {
  rollno: string;
  password: string;
}

export function useAuth() {
  const router = useRouter();

  const login = useCallback(async (formData: LoginFormData) => {
    if (!formData.rollno || !formData.password) {
      return { error: "Roll number and password are required." };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.message || "Login failed" };
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("student", JSON.stringify(result.student));
      window.dispatchEvent(new Event("authChange"));
      router.push("/dashboard");

      return { success: true };
    } catch (err) {
      return { error: "Network error. Please try again." };
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    window.dispatchEvent(new Event("authChange"));
    router.push("/login");
  }, [router]);

  return { login, logout };
}
