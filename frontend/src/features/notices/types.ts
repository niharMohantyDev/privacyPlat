export const NOTICE_TYPES = [
  { value: 'privacy_policy', label: 'Privacy Policy' },
  { value: 'terms_of_service', label: 'Terms of Service' },
  { value: 'cookie_policy', label: 'Cookie Policy' },
] as const

export type NoticeType = (typeof NOTICE_TYPES)[number]['value']

export interface PrivacyNotice {
  id: string
  notice_type: string
  title: string
  body: string
  version: number
  status: string
  change_summary: string
  published_at: string | null
  review_due_at: string | null
}

export interface CreateDraftInput {
  noticeType: NoticeType
  title: string
  body?: string
  changeSummary?: string
}

/** What useNoticeRegister/NoticeManagementPage depend on — NoticesAdminApiClient implements this. */
export interface INoticesAdminApiClient {
  listNotices(organizationId: string, noticeType?: NoticeType): Promise<PrivacyNotice[]>
  createDraft(organizationId: string, input: CreateDraftInput): Promise<PrivacyNotice>
  publish(organizationId: string, noticeId: string): Promise<PrivacyNotice>
  archive(organizationId: string, noticeId: string): Promise<PrivacyNotice>
}

export interface PublicNotice {
  notice_type: string
  title: string
  body: string
  version: number
  published_at: string | null
}

/** What useNotice/NoticePreview depend on — NoticesApiClient implements this. */
export interface INoticesApiClient {
  getPublishedNotice(noticeType: NoticeType): Promise<PublicNotice>
}
