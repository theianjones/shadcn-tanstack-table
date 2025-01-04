import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Switch } from "./components/ui/switch"
import { flexRender, createColumnHelper, useReactTable, getCoreRowModel } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { useWindowVirtualizer } from "@tanstack/react-virtual"

import { generateData } from "./data"

const data = generateData()

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
    return (<p className={cn(typeof age === 'number' && age > 20 ? "text-green-500" : "text-red-500")}>{age}</p>)
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

function App() {
  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnVisibility: {
        website: false,
      }
    }
  })

  const rowVirtualizer = useWindowVirtualizer({
    count: table.getRowCount(),
    estimateSize: () => 37,
    overscan: 5,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const tableRows = table.getRowModel().rows

  return (
    <>
    <div className="flex gap-4">
      {table.getAllColumns().map((column) => (
        <div key={column.id} className="flex flex-col items-center gap-1">
          <label htmlFor={column.id}>{column.columnDef.header?.toString()}</label>
          <Switch
            id={column.id}
            disabled={!column.getCanHide()} 
            checked={column.getIsVisible()} 
            onCheckedChange={(value) => column.toggleVisibility(value)} 
          />
        </div>
      ))}
    </div>
    <button onClick={() => rowVirtualizer.scrollToIndex(data.length - 1)}>Scroll to Bottom</button>
    <Table aria-rowcount={data.length}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="flex w-full">
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="w-full" style={{ width: `${header.getSize()}px` }}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className="relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        {virtualRows.map((virtualRow) => {
          const row = tableRows[virtualRow.index]
          return (
            <TableRow key={virtualRow.key} className="absolute flex w-full" style={{ transform: `translateY(${virtualRow.start}px)` }}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} data-label={cell.column.columnDef.header} style={{ width: `${cell.column.getSize()}px` }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
            </TableRow>
          )
        })}
        </TableBody>
      </Table>
      <button onClick={() => rowVirtualizer.scrollToIndex(0)}>Scroll to Top</button>
    </>
  )
}
export default App

