"use client";

import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  showBloggerModal,
  toggleSidebar,
} from "@/redux/slices/layoutSlice";
import type { RootState } from "@/redux/store";
import LinkItem from "./LinkItem";

import {
  CloseIcon,
  CompanyLogo,
  DashboardIcon,
  SettingsIcon,
} from "./svg-components";
import Typography from "./Typography";

export default function Sidebar() {
  const websites_ref = useRef<any>();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isEdit = pathname.includes("/dashboard/article-management/edit");
  const [showWebsitesPopup, setShowWebsitesPopup] = useState(false);

  const sideBarOpen = useSelector(
    (state: RootState) => state.layout.sideBarOpen,
  );
  // const addModalOpen = useSelector(
  //   (state: RootState) => state.layout.addSiteModal,
  // );


  // const toggleModal = () => {
  //   dispatch(toggleAddSiteModal());
  // };




  const toggleModalWebsites = useCallback(
    (event: any) => {
      if (
        !showWebsitesPopup &&
        (websites_ref.current === event.target ||
          websites_ref.current?.contains(event.target))
      ) {
        setShowWebsitesPopup(true);
      } else {
        setShowWebsitesPopup(false);
      }
    },
    [showWebsitesPopup],
  );

  useEffect(() => {
    document.addEventListener("click", toggleModalWebsites);

    return () => {
      document.removeEventListener("click", toggleModalWebsites);
    };
  }, [toggleModalWebsites]);
  // Shown Popup for integrate BloggerSites
  const searchParams = useSearchParams();

  const [bloggerIntegrate, setBloggerIntegrate] = useState<boolean>(false);

  useEffect(() => {
    setBloggerIntegrate(!!searchParams.get("bloggerIntegrate"));

    if (bloggerIntegrate) {
      dispatch(showBloggerModal());
    }
  }, [bloggerIntegrate, dispatch, searchParams]);

  return (
    <>
      <aside
        className={clsx(
          "absolute z-20 flex size-full max-h-screen min-h-screen min-w-[290px] flex-col justify-between overflow-auto border-r border-subtle bg-lightBg px-6 py-8 transition duration-300 ease-in-out lg:static lg:h-screen lg:w-[290px] lg:translate-x-0",
          isEdit ? "hidden" : "visible",
          sideBarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div>
          <div className="flex w-full items-center justify-between lg:justify-center ">
            <CompanyLogo className="h-[40px] w-[130px] lg:h-[56px] lg:w-[192px]" />
            <CloseIcon
              className="cursor-pointer lg:hidden"
              onClick={() => dispatch(toggleSidebar())}
            />
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Typography type="body" size="lg">
              Main
            </Typography>

            <ul className="flex flex-col gap-1 text-dark">
              <LinkItem href="/dashboard" title="Dashboard">
                <DashboardIcon className="size-6 " />
              </LinkItem>
              <LinkItem href="/dashboard/stocks-management" title="Stock Management">
                <DashboardIcon className="size-6 " />
              </LinkItem>
              <LinkItem href="/dashboard/customer-management" title="Customer Management">
                <DashboardIcon className="size-6 " />
              </LinkItem>

            </ul>
          </div>

          <div className="mt-6">
            <Typography type="body" size="lg">
              Others
            </Typography>
            <ul className="flex flex-col gap-1 ">
              <LinkItem href="/dashboard/settings" title="Settings">
                <SettingsIcon className="size-6 " />
              </LinkItem>
            </ul>
          </div>
        </div>

        <div className="relative flex flex-col gap-2">

        </div>
      </aside>
    </>
  );
}
