import React from "react";
import Sidebar from "../components/teacher/Sidebar";
import StatsCards from "../components/teacher/StatsCards";
import ChartsSection from "../components/teacher/ChartsSection";
import ArticlesTable from "../components/teacher/ArticlesTable";
import { useSelector, useDispatch } from "react-redux";
import { setActive } from "../store/uiSlice";

const TeacherDashboard = () => {
  const active = useSelector((state) => state.ui.active);
  const dispatch = useDispatch();

  return (
    <div className="flex pt-12">
      <Sidebar
        active={active}
        setActive={(val) => dispatch(setActive(val))}
      />

      <div className="pl-24 p-8 w-full">
        {active === "Dashboard" && (
          <>
            <StatsCards />
            <ChartsSection />
          </>
        )}

        {active === "Analytics" && <ChartsSection />}
        {active === "Articles" && <ArticlesTable />}
      </div>
    </div>
  );
};

export default TeacherDashboard;