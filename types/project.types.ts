import { Database } from './database.types'

export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type ProjectStatus = Project['status']
export type EventType = Project['event_type']

export interface ProjectWithStudio extends Project {
  studio: Database['public']['Tables']['studios']['Row']
}

export interface ProjectStats {
  totalProjects: number
  upcoming: number
  inProgress: number
  completed: number
  totalStorage: number
}
