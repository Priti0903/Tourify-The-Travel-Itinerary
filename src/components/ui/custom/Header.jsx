import React, { useEffect, useState } from "react";
import { Button } from "../button.jsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Header() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userInfo = res.data;
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
        setOpenDialog(false);

        window.dispatchEvent(new Event("userLoggedIn"));
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
  });

  useEffect(() => {
    const openDialogFromAnywhere = () => {
      setOpenDialog(true);
    };

    window.addEventListener("openLoginDialog", openDialogFromAnywhere);
    return () => window.removeEventListener("openLoginDialog", openDialogFromAnywhere);
  }, []);

  const logout = () => {
    googleLogout();
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <div className="px-6 py-4 flex justify-between items-center shadow-md border-b border-gray-200">
        <div className="flex items-center">
          <img src="/logo.svg" alt="Logo" className="h-10" />
        </div>

        <div className="inline-flex justify-center rounded-md text-sm font-medium">
          {user ? (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => navigate("/create-trip")}
              >
                + Create Trip
              </Button>

              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => navigate("/my-trips")}
              >
                My Trips
              </Button>

              <Popover>
                <PopoverTrigger>
                  <img
                    src={user?.picture || "/fallback.jpg"}
                    alt="User"
                    className="h-[35px] w-[35px] rounded-full border"
                  />
                </PopoverTrigger>
                <PopoverContent className="bg-white shadow-md p-4 z-50">
                  <div className="text-center">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <Button
                      onClick={logout}
                      className="mt-3 w-full text-red-600 border-red-600 hover:bg-red-50"
                      variant="outline"
                    >
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
          )}
        </div>
      </div>

      {/* Login Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white dark:bg-zinc-900 border p-6 rounded-xl shadow-xl z-[100]">
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white" />
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              <img src="/logo.svg" className="mx-auto" />
              <h2 className="font-bold text-lg mt-7">Sign in with Google</h2>
              <p>Sign in to generate and manage trips</p>
              <Button onClick={login} className="w-full mt-5 flex gap-4 items-center justify-center">
                <FcGoogle className="h-7 w-7" /> Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Header;
