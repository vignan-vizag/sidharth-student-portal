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
      throw new Error("Roll number and password are required.");
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("student", JSON.stringify(data.student));

    window.dispatchEvent(new Event("authChange"));

    router.push("/dashboard");
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");

    window.dispatchEvent(new Event("authChange"));

    router.push("/login");
  }, [router]);

  return { login, logout };
}
