"use client"
//we have to import a lot of things and here are they
import {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "./Button"
import React, { useState } from "react"
import { Input } from "./Input"
import { DataTablePagination } from "./DataTablePagination"
import { LucideLoader2 } from "lucide-react"

//now we are expecting 2 props: columns and the data(that we are expecting from the page component)
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    isLoading: boolean | undefined
    allowFilter?: boolean
    allowPagination?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isLoading,
    allowFilter = true,
    allowPagination = true
}: DataTableProps<TData, TValue>) {
    // and now we will use this useReactTable hook

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = React.useState<SortingState>([])
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
            sorting,
        },
        // and yes adding pagination can be done with just this above one line 

    })

    return (
        <div>
            {allowFilter && <div className="flex items-center py-4">
                <Input
                    placeholder="Filter problems..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                    className="max-w-xs bg-transparent"
                />
            </div>}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <>
                                {
                                    isLoading ?
                                        (
                                            <TableRow>
                                                <TableCell colSpan={columns.length} className="h-24 flex-row">
                                                    <LucideLoader2 className="animate-spin mx-auto" />
                                                </TableCell>
                                            </TableRow>
                                        )
                                        :
                                        (

                                            <TableRow>
                                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                                    No results.
                                                </TableCell>
                                            </TableRow>
                                        )

                                }
                            </>
                        )}
                    </TableBody>
                </Table>

                {/* <button onClick={()=>table.previousPage()}>Previous page</button>
        <button onClick={()=>table.nextPage()}>Next Page</button> */}
            </div>
            {allowPagination && <div className=" mt-3">
                <DataTablePagination table={table} />
            </div>}
            {!allowPagination &&
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>}
        </div >
    )
}