import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

import { NOTICE_TYPES, type NoticeType } from '../types'

interface NoticeDraftFormProps {
  onSubmit: (input: { noticeType: NoticeType; title: string; body: string; changeSummary: string }) => void
  isSubmitting: boolean
  errorMessage?: string | null
}

/** Presentational only — drafts a new version of a notice (create-only; there's no edit-in-place). */
export function NoticeDraftForm({ onSubmit, isSubmitting, errorMessage }: NoticeDraftFormProps) {
  const [noticeType, setNoticeType] = useState<NoticeType>('privacy_policy')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [changeSummary, setChangeSummary] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!title.trim()) return
    onSubmit({ noticeType, title: title.trim(), body: body.trim(), changeSummary: changeSummary.trim() })
  }

  return (
    <Card as="form" onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-sm font-semibold text-neutral-900">Draft a new version</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Notice type" htmlFor="notice-type">
          <Select id="notice-type" value={noticeType} onChange={(e) => setNoticeType(e.target.value as NoticeType)}>
            {NOTICE_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Title" htmlFor="notice-title">
          <Input id="notice-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
      </div>
      <Field label="Body" htmlFor="notice-body">
        <textarea
          id="notice-body"
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="The full text visitors will see."
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm transition-colors placeholder:text-neutral-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </Field>
      <Field label="Change summary (optional)" htmlFor="notice-change-summary">
        <Input
          id="notice-change-summary"
          value={changeSummary}
          onChange={(e) => setChangeSummary(e.target.value)}
          placeholder="What changed from the previous version?"
        />
      </Field>
      <Button type="submit" size="sm" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save Draft'}
      </Button>
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
    </Card>
  )
}
