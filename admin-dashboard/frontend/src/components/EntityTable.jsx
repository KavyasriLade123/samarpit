import React from "react";

export default function EntityTable({ columns, rows, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="border-b bg-slate-50 text-left text-slate-600">
                        {columns.map((col) => (
                            <th key={col.key} className="px-3 py-2">
                                {col.label}
                            </th>
                        ))}
                        <th className="px-3 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row._id} className="border-b">
                            {columns.map((col) => (
                                <td key={col.key} className="px-3 py-2">
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                            <td className="px-3 py-2">
                                <div className="flex gap-2">
                                    <button
                                        className="rounded bg-blue-100 px-2 py-1 text-blue-700"
                                        onClick={() => onEdit(row)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="rounded bg-rose-100 px-2 py-1 text-rose-700"
                                        onClick={() => onDelete(row)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
