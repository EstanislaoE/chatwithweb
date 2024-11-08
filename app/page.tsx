"use client";
import React, { useState } from "react";
import { ModeToggle } from "@/components/modetoggle";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import ReportComponent from "@/components/reportComponent";
import { useToast } from "@/hooks/use-toast";
//import ChatComponent from "@/components/chatComponent";
import ChatComponent from "@/components/ChatComponent";

type Props = {};

const HomeComponent = (props: Props) => {
  const [reportData, setreportData] = useState("");
  const { toast } = useToast();
  const onReportConfirmation = (data: string) => {
    setreportData(data);
    toast({
      description: "updated!",
    });
  };
  return (
    <div className="grid h-screen -w-full">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 h-[57px] bg-background flex items-center gap-1 border-b px-5">
          <h1 className="text-xl font-semibold text-[#30c730] ">
            Upload a File
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
                <ReportComponent onReportConfirmation={onReportConfirmation} />
              </DrawerContent>
            </Drawer>
          </div>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="hidden md:flex flex-col">
            <ReportComponent onReportConfirmation={onReportConfirmation} />
          </div>
          <div className="lg:col-span-2 bg-blue-900">
            <ChatComponent reportData={reportData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeComponent;
