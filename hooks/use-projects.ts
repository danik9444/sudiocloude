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
      const { data, error } = await supabase.functions.invoke('create-project', {
        body: project,
      })

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
