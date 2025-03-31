import React, { useState } from "react";

const StudentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    regno: "",
    branch: "",
    section: "",
    year: "",
    semester: "",
  });

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
  ];
  const sections = ["A", "B", "C", "D"];
  const years = [1, 2, 3, 4];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Exam started!");
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <h1 className="form-title">Student Exam Form</h1>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Reg No</label>
            <input
              type="text"
              name="regno"
              value={formData.regno}
              onChange={handleChange}
              required
              placeholder="Enter registration number"
            />
          </div>

          <div className="form-group">
            <label>Branch</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Section</label>
            <select
              name="section"
              value={formData.section}
              onChange={handleChange}
              required
            >
              <option value="">Select Section</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Semester</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
            >
              <option value="">Select Semester</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn">
            Start Exam
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
