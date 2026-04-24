import React from "react";

export default function Pagination({ page, total, limit, onChange }) {
    const pages = Math.max(1, Math.ceil(total / limit));
    return (
        <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
                Page {page} of {pages}
            </p>
            <div className="flex gap-2">
                <button
                    className="rounded bg-slate-200 px-3 py-1 text-sm disabled:opacity-50"
                    onClick={() => onChange(page - 1)}
                    disabled={page <= 1}
                >
                    Prev
                </button>
                <button
                    className="rounded bg-slate-800 px-3 py-1 text-sm text-white disabled:opacity-50"
                    onClick={() => onChange(page + 1)}
                    disabled={page >= pages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
