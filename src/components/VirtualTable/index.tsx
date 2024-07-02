import {
  ColumnDef,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ReactNode, useEffect, useRef, useState } from "react";
import EmptyList from "../EmptyList";
import { useDownloadExcel } from "react-export-table-to-excel";
import { excelBtnId } from "@/utils/helpers";

type ReturnFunction<Tval> = (smt: Tval) => string;
type RowClassName<T> = string | ReturnFunction<T>;

interface Props<TData> {
  data?: TData[];
  columns: ColumnDef<TData, any>[];
  className?: string;
  children?: ReactNode;
  rowClassName?: RowClassName<Row<TData>>;
  exHeight?: number;
}

function VirtualTable<T>({
  data,
  columns,
  className,
  children,
  rowClassName,
  exHeight = 0,
}: Props<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const tableRef = useRef(null);
  const btnAction = document.getElementById(excelBtnId);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "products",
    sheet: "products",
  });

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const { rows } = table.getRowModel();

  const parentRef = useRef<HTMLDivElement>(null);

  const handleRowStyles = (item: Row<T>) =>
    typeof rowClassName === "function" ? rowClassName?.(item) : rowClassName;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 55,
    overscan: 20,
  });

  const downloadAsPdf = () => onDownload();

  useEffect(() => {
    if (btnAction) {
      btnAction.addEventListener("click", () => {
        document.getElementById("table_id")?.click();
      });
    }
  }, [btnAction]);

  return (
    <div
      ref={parentRef}
      className={`${className} w-full bg-white overflow min-h-72`}
    >
      <div
        style={{ height: `${virtualizer.getTotalSize() + exHeight}px` }}
        className="overflow-x-auto min-h-72"
      >
        <table className="table table-bordered w-full" ref={tableRef}>
          <thead>
            {data &&
              table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className="bg-primary text-white"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            {children && <tr>{children}</tr>}
          </thead>
          <tbody>
            {virtualizer.getVirtualItems().map((virtualRow, index) => {
              const row = rows[virtualRow.index] as Row<T>;
              return (
                <tr
                  className={`${handleRowStyles(
                    row
                  )} border-b border-b-borderGray p-2`}
                  key={row.id}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${
                      virtualRow.start - index * virtualRow.size
                    }px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="p-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button id={"table_id"} className="hidden" onClick={downloadAsPdf}>
        download
      </button>
    </div>
  );
}

export default VirtualTable;
