import { FileTextIcon } from '@/components/icons'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Table, TableBody, TableContainer, TableHead, TableRow, Td, Th } from '@/components/ui/Table'

import type { ConsentLogRecord } from '../types'

interface ConsentLogTableProps {
  records: ConsentLogRecord[]
}

/** Presentational only — see apps/consent's ConsentBanner for the same convention. */
export function ConsentLogTable({ records }: ConsentLogTableProps) {
  if (records.length === 0) {
    return (
      <EmptyState
        icon={<FileTextIcon width={20} height={20} />}
        title="No consent records yet."
        description="Decisions recorded by the Consent Banner will show up here."
      />
    )
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <Th>Subject</Th>
            <Th>Framework</Th>
            <Th>Version</Th>
            <Th>Decisions</Th>
            <Th>Recorded</Th>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <Td className="font-mono text-xs text-neutral-500">{record.subject_key}</Td>
              <Td className="text-neutral-600">{record.framework}</Td>
              <Td className="text-neutral-600">v{record.version}</Td>
              <Td>
                <div className="flex flex-wrap gap-1">
                  {record.decisions.map((d) => (
                    <Badge key={d.purpose_code} variant={d.granted ? 'success' : 'neutral'}>
                      {d.purpose_code}
                    </Badge>
                  ))}
                </div>
              </Td>
              <Td className="whitespace-nowrap text-neutral-600">
                {new Date(record.created_at).toLocaleString()}
              </Td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
