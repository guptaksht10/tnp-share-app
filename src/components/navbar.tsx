"use client";

import { Avatar, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/sign-in");
  };

  return (
    <div className="shadow-md py-4 px-6 flex justify-end items-center">
     
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32, fontSize: 14 }} />              
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={handleLogout}
              sx={{ textTransform: "none" }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push("/sign-in")}
          >
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
}
