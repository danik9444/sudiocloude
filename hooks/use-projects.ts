'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Project, ProjectInsert } from '@/types/project.types'

export function useProjects() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, studio:studios(*)')
        .order('event_date', { ascending: false })

      if (error) throw error
      return data as Project[]
    },
  })

  const createProject = useMutation({
    mutationFn: async (project: ProjectInsert) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Get user's studio through user_profiles
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('studio_id')
        .eq('id', user.id)
        .single()

      if (profileError || !profile?.studio_id) {
        throw new Error('Studio not found')
      }

      // Generate folder path from project name and date
      const folderPath = `${project.event_date}_${project.project_name.replace(/\s+/g, '_')}`

      // Insert project
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...project,
          studio_id: profile.studio_id,
          folder_path: folderPath,
          total_size: 0,
          file_count: 0,
          event_type: 'wedding' // default value
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })

  return {
    projects,
    isLoading,
    error,
    createProject: createProject.mutate,
    isCreating: createProject.isPending,
  }
}

export function useProject(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, studio:studios(*)')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Project
    },
    enabled: !!id,
  })
}
