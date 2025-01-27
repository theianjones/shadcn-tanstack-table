import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Switch } from "./components/ui/switch"
import { flexRender, createColumnHelper, useReactTable, getCoreRowModel } from "@tanstack/react-table"
import { useWindowVirtualizer } from "@tanstack/react-virtual"

import { usePokemon, type Pokemon } from "./usePokemon"
import { Suspense, useMemo, useState } from "react"

const columnHelper = createColumnHelper<Pokemon>()

const columns = [
  columnHelper.accessor("image", { header: "Image", cell: (cell) => <div className="flex h-full items-center"><img src={cell.getValue()} alt={cell.row.original.name} /></div> }),
  columnHelper.accessor("name", { header: "Name", cell: (cell) => <div className="flex h-full items-center"><p className="capitalize">{cell.getValue()}</p></div> }),
  columnHelper.accessor("height", { header: "Height", cell: (cell) => <div className="flex h-full items-center"><p>{cell.getValue()}</p></div> }),
  columnHelper.accessor("weight", { header: "Weight", cell: (cell) => <div className="flex h-full items-center"><p>{cell.getValue()}</p></div> }),
  columnHelper.accessor("types", { header: "Types", cell: (cell) => <div className="flex h-full items-center"><p>{cell.getValue().join(", ")}</p></div> }),
  columnHelper.accessor("url", { header: "URL", cell: (cell) => {
    return (<div className="flex h-full items-center"><p>{cell.getValue()}</p></div>)
  } }),
]

const PokeTable = () => {
  const [page, setPage] = useState(0)
  const [data, fetchPokemonPage] = usePokemon()

  const results = useMemo(() => data.results, [data])

  const table = useReactTable({
    data: results,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnVisibility: {
        url: false,
      }
    }
  })

  const rowVirtualizer = useWindowVirtualizer({
    count: table.getRowCount(),
    estimateSize: () => 100,
    overscan: 5,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const tableRows = table.getRowModel().rows

  return (
    <>
    <div className="flex gap-4">
      <button onClick={
        () => {
          const newPage = page + 1
          setPage(newPage)
          fetchPokemonPage(newPage)
        }
      }>Fetch Page {page + 1}</button>
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
    <button onClick={() => rowVirtualizer.scrollToIndex(results.length - 1)}>Scroll to Bottom</button>
    <Table aria-rowcount={results.length}>
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
            <TableRow data-index={virtualRow.index} key={virtualRow.key} className="absolute flex w-full" style={{ transform: `translateY(${virtualRow.start}px)` }}>
              {row.getVisibleCells().map((cell) => (
                <TableCell  key={cell.id} data-label={cell.column.columnDef.header} style={{ width: `${cell.column.getSize()}px` }}>
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


function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PokeTable />
    </Suspense>
  )
  
}
export default App

