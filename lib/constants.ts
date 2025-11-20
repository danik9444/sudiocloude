export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'סטודיו קלאוד'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const STATUS_LABELS = {
  upcoming: 'עתידי',
  in_progress: 'בעבודה',
  in_backup: 'בגיבוי',
  completed: 'הושלם',
  archived: 'בארכיון',
} as const

export const STATUS_COLORS = {
  upcoming: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  in_backup: 'bg-purple-500',
  completed: 'bg-green-500',
  archived: 'bg-gray-500',
} as const

export const EVENT_TYPES = {
  wedding: 'חתונה',
  bar_mitzvah: 'בר/בת מצווה',
  corporate: 'אירוע עסקי',
  birthday: 'יום הולדת',
  other: 'אחר',
} as const

export const FILE_TYPE_ICONS = {
  video: '🎥',
  image: '📷',
  raw: '📸',
  other: '📄',
} as const
