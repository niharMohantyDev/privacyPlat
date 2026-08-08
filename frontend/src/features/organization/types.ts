export interface Workspace {
  id: string
  organization: string
  name: string
  slug: string
  created_at: string
}

export interface CreateWorkspaceInput {
  organization: string
  name: string
  slug: string
}

export type UpdateWorkspaceInput = Partial<Omit<CreateWorkspaceInput, 'organization'>>

export const ASSET_TYPES = [
  { value: 'website', label: 'Website' },
  { value: 'mobile_app', label: 'Mobile App' },
  { value: 'system', label: 'System' },
  { value: 'other', label: 'Other' },
] as const

export type AssetType = (typeof ASSET_TYPES)[number]['value']

export interface Asset {
  id: string
  workspace: string
  asset_type: AssetType
  name: string
  identifier: string
  public_key: string
  is_active: boolean
  created_at: string
}

export interface CreateAssetInput {
  workspace: string
  asset_type: AssetType
  name: string
  identifier: string
}

export type UpdateAssetInput = Partial<Omit<CreateAssetInput, 'workspace'>> & { is_active?: boolean }

/** What useWorkspaces/useAssets depend on — CoreAdminApiClient implements this. */
export interface ICoreAdminApiClient {
  listWorkspaces(organizationId: string): Promise<Workspace[]>
  createWorkspace(input: CreateWorkspaceInput): Promise<Workspace>
  updateWorkspace(id: string, input: UpdateWorkspaceInput): Promise<Workspace>
  deleteWorkspace(id: string): Promise<void>

  listAssets(organizationId: string): Promise<Asset[]>
  createAsset(input: CreateAssetInput): Promise<Asset>
  updateAsset(id: string, input: UpdateAssetInput): Promise<Asset>
  deleteAsset(id: string): Promise<void>
}
