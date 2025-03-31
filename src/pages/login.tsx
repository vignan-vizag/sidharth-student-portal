import React, { useState } from "react";

interface StudentFormData {
  name: string;
  regno: string;
  branch: string;
  section: string;
  year: number | "";
  semester: number | "";
}

const branches = [
  "CSE",
  "CSE-AI",
  "CSE-DS",
  "CSE-CS",
  "AIDS",
  "ECE",
  "EEE",
  "ECM",
  "MECH",
  "CIVIL",
] as const;

const sections = ["A", "B", "C", "D"] as const;
const years = [1, 2, 3, 4] as const;
const semesters = [1, 2, 3, 4, 5, 6, 7, 8] as const;

const StudentForm: React.FC = () => {
  const [formData, setFormData] = useState<StudentFormData>({
    name: "",
    regno: "",
    branch: "",
    section: "",
    year: "",
    semester: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" || name === "semester" ? Number(value) || "" : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Exam started!");
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold font-mono uppercase text-center mb-6 text-gray-800">
          Student Exam Form
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-1 gap-6">
          <div className="w-full">
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="w-full">
            <label className="block font-medium">Reg No</label>
            <input
              type="text"
              name="regno"
              value={formData.regno}
              onChange={handleChange}
              required
              placeholder="Enter registration number"
              className="w-full p-2 border rounded-md"
            />
          </div>

            <div className="w-full">
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.regno}
                onChange={handleChange}
                required
                placeholder="Enter email address"
                className="w-full p-2 border rounded-md"
              />
            </div>

          <div className="w-full">
            <label className="block font-medium">Branch</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="block font-medium">Section</label>
            <select
              name="section"
              value={formData.section}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Section</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="block font-medium">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="block font-medium">Semester</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Semester</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 col-span-2 md:col-span-1">
            <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-sans font-medium tracking-wide">
              Start Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
