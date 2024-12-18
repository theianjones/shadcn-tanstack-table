import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table"

import { flexRender, createColumnHelper, useReactTable, getCoreRowModel } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
const columnHelper = createColumnHelper<{
  name: string
  age: number
  dateOfBirth: string
  website: string
  favoriteColor: string
  isActive: boolean
}>()

const columns = [
  columnHelper.accessor("name", { header: "Name", cell: (cell) => <p className="capitalize">{cell.getValue()}</p> }),
  columnHelper.accessor("age", { header: "Age", cell: (cell) => {
    const age = cell.getValue()
    return (<p className={cn(age > 20 ? "text-green-500" : "text-red-500")}>{age}</p>)
  } }),
  columnHelper.accessor("dateOfBirth", { header: "Date of Birth", cell: (cell) => {
    const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" })
    return (<p>{dateFormatter.format(new Date(cell.getValue()))}</p>)
  } }),
  columnHelper.accessor("website", { header: "Website", cell: (cell) => {
    return (<p>{cell.getValue()}</p>)
  } }),
  columnHelper.accessor("favoriteColor", { header: "Favorite Color", cell: (cell) => {
    return (<p>{cell.getValue()}</p>)
  } }),
  columnHelper.accessor("isActive", { header: "Is Active", cell: (cell) => {
    return (<p>{cell.getValue() ? "Yes" : "No"}</p>)
  } }),
]

const data = [
  { name: "john", age: 20, dateOfBirth: "1990-01-01", website: "https://www.google.com", favoriteColor: "blue", isActive: true },
  { name: "Jane", age: 21, dateOfBirth: "1991-02-02", website: "https://www.google.com", favoriteColor: "green", isActive: false },
  { name: "Doe", age: 22, dateOfBirth: "1992-03-03", website: "https://www.google.com", favoriteColor: "red", isActive: true },
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
              <TableCell key={cell.id} data-label={cell.column.columnDef.header}>
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

