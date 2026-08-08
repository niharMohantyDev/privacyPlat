import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OpenOverdueBarChart } from '../components/OpenOverdueBarChart'

describe('OpenOverdueBarChart', () => {
  it('renders the title and a legend entry per series', () => {
    render(
      <OpenOverdueBarChart
        data={[
          { name: 'DSARs', onTrack: 3, overdue: 1 },
          { name: 'Cases', onTrack: 1, overdue: 1 },
        ]}
      />,
    )

    expect(screen.getByText('Open Items: On Track vs Overdue')).toBeInTheDocument()
    expect(screen.getByText('On track')).toBeInTheDocument()
    expect(screen.getByText('Overdue')).toBeInTheDocument()
  })
})
