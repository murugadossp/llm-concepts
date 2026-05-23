type CompareTableProps = {
  columns?: string[];
  rows?: string[][];
};

export function CompareTable({ columns = [], rows = [] }: CompareTableProps) {
  return (
    <div className="glass my-8 overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr style={{ background: "var(--surface-strong)" }}>
            {columns.map((column) => (
              <th
                key={column}
                className="sticky top-0 px-4 py-3 font-semibold"
                style={{ color: "var(--ink)", borderBottom: "1px solid var(--border-strong)" }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={row.join("-")}
              style={{
                background: rowIndex % 2 === 0 ? "transparent" : "var(--surface)",
              }}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`${rowIndex}-${cellIndex}`}
                  className="px-4 py-3 align-top leading-6"
                  style={{ color: "var(--ink-soft)", borderBottom: "1px solid var(--border)" }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
