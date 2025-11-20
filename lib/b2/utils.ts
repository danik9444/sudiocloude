/**
 * Generate B2 file path
 */
export function generateFilePath(
  studioId: string,
  projectId: string,
  fileName: string
): string {
  const timestamp = Date.now()
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  return `studios/${studioId}/projects/${projectId}/${timestamp}-${sanitizedName}`
}

/**
 * Parse file type from mime type
 */
export function parseFileType(mimeType: string): 'video' | 'image' | 'raw' | 'other' {
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('image/')) {
    // Check if it's RAW format
    const rawFormats = ['image/x-canon-cr2', 'image/x-nikon-nef', 'image/x-sony-arw']
    if (rawFormats.includes(mimeType) || mimeType.includes('raw')) {
      return 'raw'
    }
    return 'image'
  }
  return 'other'
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Calculate storage tier based on last access
 */
export function calculateStorageTier(
  lastAccessed: Date,
  created: Date
): 'hot' | 'warm' | 'cold' {
  const now = new Date()
  const daysSinceAccess = Math.floor(
    (now.getTime() - lastAccessed.getTime()) / (1000 * 60 * 60 * 24)
  )
  const daysSinceCreation = Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysSinceAccess <= 7) return 'hot'
  if (daysSinceCreation <= 60) return 'warm'
  return 'cold'
}
