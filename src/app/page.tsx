"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";

export default function Page() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loginStatus === "true");

    if (isLoggedIn) {
      router.push("/admin");
    } else {
      router.push("/sign-in");
    }
  }, [router]); 

  return (
    <>
      <Typography variant="h6" className="text-white p-8 font-bold">
        Redirecting...
      </Typography>
      <div className="flex justify-center items-center">
        <CircularProgress />
      </div>
    </>
  )
}