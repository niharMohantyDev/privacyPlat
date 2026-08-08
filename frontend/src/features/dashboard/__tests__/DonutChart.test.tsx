import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DonutChart } from '../components/DonutChart'

describe('DonutChart', () => {
  it('renders the title', () => {
    render(
      <DonutChart
        title="DSAR Resolution"
        emptyMessage="No requests resolved yet."
        data={[
          { name: 'On time', value: 5, color: '#10b981' },
          { name: 'Late', value: 1, color: '#ef4444' },
        ]}
      />,
    )
    expect(screen.getByText('DSAR Resolution')).toBeInTheDocument()
  })

  it('shows the empty message when every value is zero', () => {
    render(
      <DonutChart
        title="Open Case Mix"
        emptyMessage="No open cases."
        data={[
          { name: 'Breach', value: 0, color: '#ef4444' },
          { name: 'Grievance', value: 0, color: '#3b82f6' },
        ]}
      />,
    )
    expect(screen.getByText('No open cases.')).toBeInTheDocument()
  })

  it('shows the empty message when data is an empty array', () => {
    render(<DonutChart title="Consent Opt-In Rate" emptyMessage="No consent decisions recorded yet." data={[]} />)
    expect(screen.getByText('No consent decisions recorded yet.')).toBeInTheDocument()
  })

  it('renders the legend and does not show the empty message when data is present', () => {
    render(
      <DonutChart
        title="Open Case Mix"
        emptyMessage="No open cases."
        data={[
          { name: 'Breach', value: 1, color: '#ef4444' },
          { name: 'Grievance', value: 1, color: '#3b82f6' },
        ]}
      />,
    )
    expect(screen.queryByText('No open cases.')).not.toBeInTheDocument()
    expect(screen.getByText('Breach')).toBeInTheDocument()
    expect(screen.getByText('Grievance')).toBeInTheDocument()
  })

  it('renders the center label when provided', () => {
    render(
      <DonutChart
        title="Consent Opt-In Rate"
        emptyMessage="No consent decisions recorded yet."
        centerLabel="72.5%"
        data={[
          { name: 'Opted in', value: 72.5, color: '#4f46e5' },
          { name: 'Opted out', value: 27.5, color: '#e5e5e5' },
        ]}
      />,
    )
    expect(screen.getByText('72.5%')).toBeInTheDocument()
  })
})
