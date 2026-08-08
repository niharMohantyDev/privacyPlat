import type { AxiosInstance } from 'axios'

import { api } from '@/lib/api'

import type {
  Asset,
  CreateAssetInput,
  CreateWorkspaceInput,
  ICoreAdminApiClient,
  UpdateAssetInput,
  UpdateWorkspaceInput,
  Workspace,
} from '../types'

interface PaginatedResponse<T> {
  count: number
  results: T[]
}

/**
 * WorkspaceViewSet/AssetViewSet (apps.core) scope get_queryset() to
 * "every org the user belongs to", not one organization_id — same as
 * PurposeViewSet, so listWorkspaces filters client-side the same way
 * ConsentAdminApiClient does.
 *
 * AssetSerializer only returns a `workspace` id, not the owning
 * organization, so listAssets can't filter by organization_id directly
 * either — it first resolves the org's workspace ids, then filters
 * assets against that set. A real "list assets for an org" backend
 * endpoint would be a reasonable follow-up if this join ever shows up
 * as a performance problem; for the current data volume it's fine.
 */
export class CoreAdminApiClient implements ICoreAdminApiClient {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance = api) {
    this.http = http
  }

  async listWorkspaces(organizationId: string): Promise<Workspace[]> {
    const response = await this.http.get<PaginatedResponse<Workspace>>('/api/workspaces/')
    return response.data.results.filter((w) => w.organization === organizationId)
  }

  async createWorkspace(input: CreateWorkspaceInput): Promise<Workspace> {
    const response = await this.http.post<Workspace>('/api/workspaces/', input)
    return response.data
  }

  async updateWorkspace(id: string, input: UpdateWorkspaceInput): Promise<Workspace> {
    const response = await this.http.patch<Workspace>(`/api/workspaces/${id}/`, input)
    return response.data
  }

  async deleteWorkspace(id: string): Promise<void> {
    await this.http.delete(`/api/workspaces/${id}/`)
  }

  async listAssets(organizationId: string): Promise<Asset[]> {
    const workspaces = await this.listWorkspaces(organizationId)
    const workspaceIds = new Set(workspaces.map((w) => w.id))

    const response = await this.http.get<PaginatedResponse<Asset>>('/api/assets/')
    return response.data.results.filter((a) => workspaceIds.has(a.workspace))
  }

  async createAsset(input: CreateAssetInput): Promise<Asset> {
    const response = await this.http.post<Asset>('/api/assets/', input)
    return response.data
  }

  async updateAsset(id: string, input: UpdateAssetInput): Promise<Asset> {
    const response = await this.http.patch<Asset>(`/api/assets/${id}/`, input)
    return response.data
  }

  async deleteAsset(id: string): Promise<void> {
    await this.http.delete(`/api/assets/${id}/`)
  }
}
