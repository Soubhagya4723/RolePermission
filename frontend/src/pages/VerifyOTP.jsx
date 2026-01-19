import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("verifyEmail");

  const submit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/verify-otp", { email, otp });
      localStorage.removeItem("verifyEmail");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={submit}>
        <h2>Verify OTP</h2>

        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button>Verify</button>
      </form>
    </div>
  );
};

export default VerifyOTP;
