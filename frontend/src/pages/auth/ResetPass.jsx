import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPass = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEvent = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("email");

    if (!email) {
      toast.error("Session expired. Please enter your email again.");
     navigate("/forgot-password");
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            newPass: newPassword,
            CPass: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.msg || "Failed to reset password");
        return;
      }

      toast.success(data.msg || "Password reset successful!");
      localStorage.removeItem("email"); 

      setTimeout(() => {
        if (localStorage.getItem("token")) {
          navigate("/my-profile");
        } else {
          navigate("/login");
        }
      }, 1500);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-vh-100 d-flex align-items-center bg-light-cream py-5">
      <div className="container">
        <div className="row justify-content-center w-100 m-0">
          {/* Exact viewport alignment layout scale */}
          <div className="col-12 col-sm-10 col-md-7 col-lg-4 p-0">
            <div className="card border-0 rounded-4 shadow-sm p-4 p-sm-5 bg-white auth-container-card position-relative overflow-hidden">
              
              {/* Premium Top Brand Strip Accent */}
              <div className="position-absolute top-0 start-0 w-100" style={{ height: '4px', backgroundColor: 'var(--primary-orange)' }}></div>

              {/* Branding Typography Headers */}
              <div className="text-center mb-4 mt-2">
                <h3 className="fw-bold text-dark font-traditional mb-1 fs-3">
                  Reset Password
                </h3>
                <p className="text-muted small">
                  Please configure your new secure account password credentials
                </p>
              </div>

              {/* Core Execution Form */}
              <form onSubmit={handleEvent} className="d-flex flex-column gap-3">
                
                {/* New Password Input */}
                <div className="form-group-block text-start">
                  <label className="small fw-semibold text-dark mb-1.5 ms-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-control px-3 py-2.5 rounded-3 form-pro-input shadow-none"
                    disabled={loading}
                    required
                  />
                </div>

                {/* Confirm Password Input */}
                <div className="form-group-block text-start">
                  <label className="small fw-semibold text-dark mb-1.5 ms-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-control px-3 py-2.5 rounded-3 form-pro-input shadow-none"
                    disabled={loading}
                    required
                  />
                </div>

                {/* Action Submit Button with loading protection */}
                <button 
                  type="submit" 
                  className="btn btn-orange w-100 py-2.5 rounded-3 fw-bold shadow-sm text-uppercase tracking-wider mt-3 btn-auth-submit d-flex align-items-center justify-content-center gap-2"
                  style={{ fontSize: '13.5px', letterSpacing: '0.5px' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>

              {/* Redirection Anchor Footer links */}
              <div className="text-center mt-4 pt-1 border-top border-light">
                <p className="text-muted small mb-0">
                  Want to abort recovery?{' '}
                  <NavLink 
                    to={localStorage.getItem("token") ? "/my-profile" : "/login"} 
                    className="text-primary-orange fw-bold text-decoration-none hover-underline-trigger"
                  >
                    Cancel
                  </NavLink>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPass;