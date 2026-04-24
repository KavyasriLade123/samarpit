import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function IDCard({ id, type, person }) {
    const downloadCard = async () => {
        const node = document.getElementById(id);
        if (!node) return;
        const canvas = await html2canvas(node);
        const image = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(image, "PNG", 10, 10, 190, 100);
        pdf.save(`${type}-${person.name}.pdf`);
    };

    return (
        <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div
                id={id}
                className="mx-auto w-full max-w-sm rounded-xl border bg-gradient-to-br from-slate-50 to-blue-50 p-4"
            >
                <h4 className="font-bold text-slate-800">Samarpit {type} ID Card</h4>
                <div className="mt-3 flex gap-3">
                    <img
                        src={person.photoUrl || "https://i.pravatar.cc/100"}
                        alt={person.name}
                        className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="text-sm">
                        <p>
                            <strong>Name:</strong> {person.name}
                        </p>
                        <p>
                            <strong>ID:</strong> {person.studentId || person.employeeId}
                        </p>
                        <p>
                            <strong>{type === "Student" ? "Course" : "Department"}:</strong>{" "}
                            {person.course || person.department}
                        </p>
                        <p>
                            <strong>Contact:</strong> {person.phone}
                        </p>
                    </div>
                </div>
            </div>
            <button
                onClick={downloadCard}
                className="mt-3 rounded bg-slate-900 px-3 py-2 text-sm text-white"
            >
                Download PDF
            </button>
        </div>
    );
}
