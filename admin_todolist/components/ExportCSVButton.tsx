"use client";
import Papa from "papaparse";
const ExportCSVButton = ({
  data,
  filename,
}: {
  data: any[];
  filename: string;
}) => {
  const handleExport = async () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <button
      onClick={handleExport}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Get Insight (CSV)
    </button>
  );
};

export default ExportCSVButton;
