import { Database } from './database.types'

export type File = Database['public']['Tables']['files']['Row']
export type FileInsert = Database['public']['Tables']['files']['Insert']
export type FileUpdate = Database['public']['Tables']['files']['Update']

export type FileType = File['file_type']
export type StorageTier = File['storage_tier']

export interface FileWithProject extends File {
  project: Database['public']['Tables']['projects']['Row']
}

export interface UploadProgress {
  file: globalThis.File
  progress: number
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error'
  error?: string
}
