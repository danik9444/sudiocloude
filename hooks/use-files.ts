'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { File } from '@/types/file.types'

export function useFiles(projectId: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: files, isLoading, error } = useQuery({
    queryKey: ['files', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('project_id', projectId)
        .order('uploaded_at', { ascending: false })

      if (error) throw error
      return data as File[]
    },
    enabled: !!projectId,
  })

  const deleteFile = useMutation({
    mutationFn: async (fileId: string) => {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
    },
  })

  return {
    files,
    isLoading,
    error,
    deleteFile: deleteFile.mutate,
    isDeleting: deleteFile.isPending,
  }
}
