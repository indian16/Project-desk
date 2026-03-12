import React from "react";

const AcademicYearSelector = ({ years, selectedYear, setSelectedYear }) => {
  return (
    <div className="mb-6 flex items-center gap-4">
      <label className="font-medium">Select Academic Year:</label>

      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="border p-2 rounded"
      >
        {years.map((y, index) => (
          <option key={index} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AcademicYearSelector;