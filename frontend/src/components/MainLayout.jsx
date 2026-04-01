import React from "react";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />

      {/* Content */}
      <div className="mt-16 p-4">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;