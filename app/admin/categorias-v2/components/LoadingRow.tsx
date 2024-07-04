'use client'

import { Placeholder, TableCell, TableRow } from '@aws-amplify/ui-react'

type LoadingRowProps = {
  rows?: number
  columns?: number
  height?: number
  width?: number
}

export default function LoadingRow(props?: LoadingRowProps) {
  return Array.from({ length: props?.rows ?? 5 }).map((_, indexRow) => (
    <TableRow key={indexRow}>
      {Array.from({ length: props?.columns ?? 5 }).map((_, indexColumn) => {
        const id = indexRow + indexColumn
        let width: number = props?.width ?? 0

        if (indexColumn === 0) {
          return <TableCell key={id}></TableCell>
        }

        if (indexColumn === 4) {
          width = 197.111
        }

        return (
          <TableCell
            key={id}
            textAlign="center"
            width={width}
            height={props?.height ?? 68.281}
          >
            <Placeholder height="small" />
          </TableCell>
        )
      })}
    </TableRow>
  ))
}
