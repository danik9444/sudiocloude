'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useQueryClient } from '@tanstack/react-query'
import type { UploadProgress } from '@/types/file.types'

export function useUpload(projectId: string) {
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  const supabase = createClient()
  const queryClient = useQueryClient()

  const uploadFiles = useCallback(
    async (files: File[]) => {
      // Initialize upload progress
      const initialUploads: UploadProgress[] = files.map((file) => ({
        file,
        progress: 0,
        status: 'pending',
      }))
      setUploads(initialUploads)

      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        try {
          // Update status to uploading
          setUploads((prev) =>
            prev.map((u, idx) =>
              idx === i ? { ...u, status: 'uploading' } : u
            )
          )

          // 1. Get presigned upload URL
          const { data: urlData, error: urlError } = await supabase.functions.invoke(
            'get-upload-url',
            {
              body: {
                projectId,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type,
              },
            }
          )

          if (urlError) throw urlError

          // 2. Upload to B2
          const xhr = new XMLHttpRequest()
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const percentComplete = (e.loaded / e.total) * 100
              setUploads((prev) =>
                prev.map((u, idx) =>
                  idx === i ? { ...u, progress: percentComplete } : u
                )
              )
            }
          })

          await new Promise((resolve, reject) => {
            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response)
              } else {
                reject(new Error(`Upload failed: ${xhr.statusText}`))
              }
            }
            xhr.onerror = () => reject(new Error('Upload failed'))

            xhr.open('PUT', urlData.uploadUrl)
            xhr.setRequestHeader('Content-Type', file.type)
            xhr.send(file)
          })

          // 3. Save file metadata to database
          const { error: dbError } = await supabase.from('files').insert({
            project_id: projectId,
            file_name: file.name,
            file_path: urlData.filePath,
            file_size: file.size,
            file_type: file.type.startsWith('video/')
              ? 'video'
              : file.type.startsWith('image/')
              ? 'image'
              : 'other',
            mime_type: file.type,
            cdn_url: urlData.cdnUrl,
          })

          if (dbError) throw dbError

          // Update status to completed
          setUploads((prev) =>
            prev.map((u, idx) =>
              idx === i ? { ...u, status: 'completed', progress: 100 } : u
            )
          )
        } catch (error) {
          console.error('Upload error:', error)
          setUploads((prev) =>
            prev.map((u, idx) =>
              idx === i
                ? {
                    ...u,
                    status: 'error',
                    error: error instanceof Error ? error.message : 'Upload failed',
                  }
                : u
            )
          )
        }
      }

      // Invalidate queries to refresh file list
      queryClient.invalidateQueries({ queryKey: ['files', projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
    },
    [projectId, supabase, queryClient]
  )

  const clearUploads = useCallback(() => {
    setUploads([])
  }, [])

  return {
    uploads,
    uploadFiles,
    clearUploads,
    isUploading: uploads.some((u) => u.status === 'uploading'),
  }
}
