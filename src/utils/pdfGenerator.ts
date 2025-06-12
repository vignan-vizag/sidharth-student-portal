import jsPDF from 'jspdf';
import { Test, Student } from '@/types';

interface GenerateReportPDFParams {
  student: Student;
  test: Test;
  assignedTest: any;
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
}

export const generateReportPDF = async ({
  student,
  test,
  assignedTest,
  obtainedMarks,
  totalMarks,
  percentage
}: GenerateReportPDFParams) => {
  const pdf = new jsPDF();
  
  // Set up the document
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 20;
  let yPosition = margin;

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Assessment Report', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Student Information
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Student Information', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const studentInfo = [
    `Name: ${student.name}`,
    `Roll Number: ${student.rollno}`,
    `Email: ${student.email}`,
    `Year: ${student.year}`,
    `Branch: ${student.branch}`,
    `Section: ${student.section}`,
    `Semester: ${student.semester}`
  ];

  studentInfo.forEach((info) => {
    pdf.text(info, margin, yPosition);
    yPosition += 8;
  });

  yPosition += 10;

  // Test Information
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Test Information', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Test Name: ${test.testName}`, margin, yPosition);
  yPosition += 8;
  pdf.text(`Status: ${assignedTest.status}`, margin, yPosition);
  yPosition += 8;
  pdf.text(`Date Completed: ${new Date(assignedTest.end).toLocaleDateString()}`, margin, yPosition);
  yPosition += 8;

  // Categories
  pdf.text(`Categories: ${test.categories.map(cat => cat.categoryName).join(', ')}`, margin, yPosition);
  yPosition += 15;

  // Overall Results
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Overall Results', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Total Score: ${obtainedMarks}/${totalMarks}`, margin, yPosition);
  yPosition += 8;
  pdf.text(`Percentage: ${percentage.toFixed(2)}%`, margin, yPosition);
  yPosition += 8;

  // Grade based on percentage
  let grade = 'F';
  let gradeColor: [number, number, number] = [255, 0, 0]; // Red
  if (percentage >= 90) {
    grade = 'A+';
    gradeColor = [0, 128, 0]; // Green
  } else if (percentage >= 80) {
    grade = 'A';
    gradeColor = [0, 128, 0]; // Green
  } else if (percentage >= 70) {
    grade = 'B';
    gradeColor = [255, 165, 0]; // Orange
  } else if (percentage >= 60) {
    grade = 'C';
    gradeColor = [255, 165, 0]; // Orange
  } else if (percentage >= 50) {
    grade = 'D';
    gradeColor = [255, 0, 0]; // Red
  }

  pdf.setTextColor(gradeColor[0], gradeColor[1], gradeColor[2]);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Grade: ${grade}`, margin, yPosition);
  pdf.setTextColor(0, 0, 0); // Reset to black
  yPosition += 15;

  // Category-wise breakdown
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Category-wise Performance', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');

  test.categories.forEach((category) => {
    const categoryMarks = assignedTest.marks[category.categoryName] || 0;
    const categoryTotal = category.questions.length;
    const categoryPercentage = categoryTotal > 0 ? (categoryMarks / categoryTotal) * 100 : 0;

    pdf.text(`${category.categoryName}:`, margin, yPosition);
    pdf.text(`${categoryMarks}/${categoryTotal} (${categoryPercentage.toFixed(1)}%)`, margin + 80, yPosition);
    yPosition += 8;

    // Add a progress bar
    const barWidth = 100;
    const barHeight = 4;
    const fillWidth = (categoryMarks / categoryTotal) * barWidth;
    
    // Background bar
    pdf.setFillColor(220, 220, 220);
    pdf.rect(margin, yPosition, barWidth, barHeight, 'F');
    
    // Fill bar
    const fillColor: [number, number, number] = categoryPercentage >= 70 ? [0, 128, 0] : categoryPercentage >= 50 ? [255, 165, 0] : [255, 0, 0];
    pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    pdf.rect(margin, yPosition, fillWidth, barHeight, 'F');
    
    yPosition += 15;
  });

  // Footer
  yPosition = pdf.internal.pageSize.height - 30;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Generated on: ' + new Date().toLocaleString(), margin, yPosition);
  pdf.text('Assessment Portal - Vignan University', pageWidth - margin, yPosition, { align: 'right' });

  // Save the PDF
  const fileName = `${student.rollno}_${test.testName.replace(/\s+/g, '_')}_Report.pdf`;
  pdf.save(fileName);
};
