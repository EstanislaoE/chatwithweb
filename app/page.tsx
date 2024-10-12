"use client";
import React from "react";
import { ModeToggle } from "@/components/modetoggle";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import ReportComponent from "@/components/reportComponent";

type Props = {};

const HomeComponent = (props: Props) => {
  return (
    <div className="grid h-screen -w-full">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 h-[57px] bg-background flex items-center gap-1 border-b px-5">
          <h1 className="text-xl font-semibold text-[#30c730] ">
            Welcome human
          </h1>
          <div className="w-full flex flex-row justify-end gap-2">
            <ModeToggle />
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant={"outline"} size={"icon"} className="md:hidden">
                  <Settings />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[80vh]">
                <ReportComponent />
              </DrawerContent>
            </Drawer>
          </div>
        </header>
      </div>
    </div>
  );
};

export default HomeComponent;
