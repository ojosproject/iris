import React, { useState } from "react";
import LogTab from "../page";
import MedicineView from "@/app/medview/page";

const NavigationProvider: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>("logView");
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page);
    if (data) {
      setSelectedLog(data);
    }
  };

  return (
    <div>
      {currentPage === "logView" && <LogTab navigate={handleNavigate} />}
      {currentPage === "medView" && <MedicineView data={selectedLog} />}
    </div>
  );
};

export default NavigationProvider;
