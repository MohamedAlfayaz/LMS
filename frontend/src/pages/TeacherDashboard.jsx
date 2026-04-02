import React from "react";
import TeacherCards from "../components/teacher/TeacherCards";
import ChartsSection from "../components/teacher/ChartsSection";
import AddStudent from "../components/teacher/AddStudent";

import { FiPlus } from "react-icons/fi";
import Button from "../components/ui/Button";

import { useDispatch, useSelector } from "react-redux";
import { openModal, closeModal } from "../store/modalSlice";

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { modalOpen } = useSelector((state) => state.modal);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between mt-3 items-center">
        <h1 className="text-2xl font-bold">
          Teacher Dashboard
        </h1>

        <Button
          onClick={() => dispatch(openModal())}
          variant="success"
        >
          <FiPlus />
          Add Student
        </Button>
      </div>

      <TeacherCards />
      <ChartsSection />

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center p-4 items-center z-50"
          onClick={() => dispatch(closeModal())}
        >
          <div
            className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <AddStudent />
          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherDashboard;