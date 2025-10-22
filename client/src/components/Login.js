import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() && !form.password.trim()) {
      toast.error("Please enter email and password!");
      return;
    } else if (!form.email.trim()) {
      toast.error("Please enter your email!");
      return;
    } else if (!form.password.trim()) {
      toast.error("Please enter your password!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        if (data.message === "User not found" || data.message === "Invalid credentials") {
          toast.error("Enter proper credentials");
        } else {
          toast.error(data.message || "Login failed");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server");
    }
  };

  return (
    <div className="auth-container" style={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 style={styles.title}>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>

      <p style={styles.switchText}>
        Don’t have an account?{" "}
        <Link to="/signup" style={styles.link}>
          Create one
        </Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "60px auto",
    padding: "20px",
    textAlign: "center",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  title: { fontSize: "1.8rem", color: "#333", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1rem",
  },
  button: {
    padding: "10px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  switchText: { marginTop: "15px", color: "#555" },
  link: { color: "#4f46e5", textDecoration: "none", fontWeight: "500" },
};
