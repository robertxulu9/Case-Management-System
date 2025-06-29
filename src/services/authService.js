// API URL
const API_URL = "http://localhost:5000/api";

class AuthService {
  // Store token in localStorage
  setToken(token) {
    localStorage.setItem("token", token);
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem("token");
  }

  // Remove token from localStorage
  removeToken() {
    localStorage.removeItem("token");
  }

  // Sign up
  async signup(userData) {
    try {
      console.log('Sending signup request with data:', {
        firstname: userData.firstName,
        lastname: userData.lastName,
        email: userData.email
      });

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: userData.firstName,
          lastname: userData.lastName,
          email: userData.email,
          password: userData.password
        }),
      });

      console.log('Signup response status:', response.status);
      const responseData = await response.json();
      console.log('Signup response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || "Failed to sign up");
      }

      this.setToken(responseData.token);
      return responseData;
    } catch (error) {
      console.error("Signup error details:", {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Sign in
  async signin(credentials) {
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to sign in");
      }

      const data = await response.json();
      this.setToken(data.token);
      return data;
    } catch (error) {
      console.error("Signin error:", error);
      throw error;
    }
  }

  // Sign out
  async signout() {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(`${API_URL}/auth/signout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      this.removeToken();
    } catch (error) {
      console.error("Signout error:", error);
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to process password reset request");
      }

      return await response.json();
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reset password");
      }

      return await response.json();
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Get current user from token
  getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Decode JWT token (you might want to use a library like jwt-decode)
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
}

// Create a singleton instance
const authService = new AuthService();

export { authService }; 