// /pages/AuthCallback.jsx

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { account } from "../lib/appwrite";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    if (userId && secret) {
      account.updateVerification(userId, secret)
        .then(() => {
          setStatus("Email verified! Redirecting...");
          setTimeout(() => navigate("/login"), 2000);
        })
        .catch((err) => {
          console.error(err);
          setStatus("Verification failed.");
        });
    } else {
      setStatus("Invalid verification link.");
    }
  }, []);

  return (
    <div className="text-center mt-10">
      <p>{status}</p>
    </div>
  );
};

export default AuthCallback;
