import type { HTMLAttributes, TableHTMLAttributes } from 'react'

export function TableContainer({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm ${className}`.trim()}
      {...rest}
    />
  )
}

export function Table({ className = '', ...rest }: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={`w-full text-left text-sm ${className}`.trim()} {...rest} />
}

export function TableHead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="bg-neutral-50/80 text-xs font-semibold uppercase tracking-wide text-neutral-500" {...props} />
}

export function TableBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className="divide-y divide-neutral-100" {...props} />
}

export function TableRow({ className = '', ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={`transition-colors hover:bg-neutral-50/70 ${className}`.trim()} {...rest} />
}

export function Th({ className = '', ...rest }: HTMLAttributes<HTMLTableCellElement>) {
  return <th className={`px-4 py-3 font-semibold first:pl-5 last:pr-5 ${className}`.trim()} {...rest} />
}

export function Td({ className = '', ...rest }: HTMLAttributes<HTMLTableCellElement>) {
  return <td className={`px-4 py-3 text-neutral-700 first:pl-5 last:pr-5 ${className}`.trim()} {...rest} />
}
