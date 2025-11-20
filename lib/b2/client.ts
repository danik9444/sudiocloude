import { S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'

// S3-compatible client for B2
export const b2Client = new S3Client({
  endpoint: process.env.B2_ENDPOINT!,
  region: process.env.B2_REGION!,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APPLICATION_KEY!,
  },
})

// Generate presigned upload URL
export async function generateUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  })

  return await getSignedUrl(b2Client, command, { expiresIn })
}

// Generate presigned download URL
export async function generateDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME!,
    Key: key,
  })

  return await getSignedUrl(b2Client, command, { expiresIn })
}

// Get CDN URL (via Cloudflare)
export function getCdnUrl(key: string): string {
  return `${process.env.CDN_DOMAIN}/${key}`
}
