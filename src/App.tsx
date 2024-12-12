import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table"

import { flexRender, createColumnHelper, useReactTable, getCoreRowModel } from "@tanstack/react-table"

const columnHelper = createColumnHelper<{
  name: string
  age: number
}>()

const columns = [
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("age", { header: "Age" }),
]

const data = [
  { name: "John", age: 20 },
  { name: "Jane", age: 21 },
  { name: "Doe", age: 22 },
]

function App() {
  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
export default App

