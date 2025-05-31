"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Settings",
//   description: "Settings",
// };

export default function Settings() {
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");
  const [selectBox, setSelectedBox] = useState<string>(tab ?? "profile");

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("tab");
    window.history.replaceState({}, "", url.toString());
  }, []);

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      <h1 className="text-[22px] font-semibold md:hidden">Settings</h1>
      <div className="flex flex-wrap gap-[2px] gap-y-4 py-2 md:gap-6 md:p-4">
        <div
          className={`cursor-pointer px-2 pb-[9px] text-sm md:px-3 md:text-base ${selectBox === "profile" && "border-b-2 border-primary font-medium"}`}
          onClick={() => setSelectedBox("profile")}
        >
          Profile
        </div>
        <div
          className={`cursor-pointer px-2 pb-[9px] text-sm md:px-3 md:text-base ${selectBox === "security" && "border-b-2 border-primary font-medium"}`}
          onClick={() => setSelectedBox("security")}
        >
          Security
        </div>
        {/*<div*/}
        {/*  className={`cursor-pointer px-2 pb-[9px] text-sm md:px-3 md:text-base ${selectBox === "notifications" && "border-b-2 border-primary font-medium"}`}*/}
        {/*  onClick={() => setSelectedBox("notifications")}*/}
        {/*>*/}
        {/*  Notifications*/}
        {/*</div>*/}
        <div
          className={`cursor-pointer px-2 pb-[9px] text-sm md:px-3 md:text-base ${selectBox === "api" && "border-b-2 border-primary font-medium"}`}
          onClick={() => setSelectedBox("api")}
        >
          API & Integration
        </div>
      </div>
      {/* Profile Settings */}
      {selectBox === "profile" && <div>Profile</div>}
      {/* Security Settings */}
      {/*{selectBox === "security" && <SecuritySettings />}*/}
      {/* Notifications Settings */}
      {/*{selectBox === "notifications" && <NotificationSettings />}*/}
    </div>
  );
}
