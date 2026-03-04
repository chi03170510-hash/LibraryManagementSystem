// Utilities to convert Google Drive links to embeddable URLs for images and PDFs

// Extract a Google Drive file id from various link formats
export function extractDriveId(url?: string | null): string | null {
  if (!url) return null;
  try {
    // Common patterns:
    // - https://drive.google.com/file/d/<id>/view?usp=sharing
    // - https://drive.google.com/file/d/<id>/preview
    // - https://drive.google.com/open?id=<id>
    // - https://drive.google.com/uc?export=download&id=<id>
    // - https://drive.google.com/uc?id=<id>&export=view
    const u = new URL(url);
    if (u.hostname.includes('drive.google.com')) {
      // Try query param id
      const qpId = u.searchParams.get('id');
      if (qpId) return qpId;

      // Try /d/<id>/ segments
      const parts = u.pathname.split('/');
      const dIndex = parts.findIndex((p) => p === 'd');
      if (dIndex !== -1 && parts.length > dIndex + 1) {
        const id = parts[dIndex + 1];
        if (id && id !== 'view' && id !== 'preview') return id;
      }
    }
  } catch {
    // ignore invalid URL
  }
  return null;
}

export function toDriveImageUrl(url?: string | null): string | null {
  const id = extractDriveId(url || undefined);
  if (!id) return url ?? null;
  // uc?export=view renders embeddable image
  return `https://drive.google.com/uc?export=view&id=${id}`;
}

export function toDrivePdfPreviewUrl(url?: string | null): string | null {
  const id = extractDriveId(url || undefined);
  if (!id) return url ?? null;
  // /file/d/<id>/preview renders PDF viewer in iframe
  return `https://drive.google.com/file/d/${id}/preview`;
}

// Prefer using Drive thumbnail for covers (works well even for some non-image files)
export function toDriveThumbnailUrl(url?: string | null, width: number = 256): string | null {
  const id = extractDriveId(url || undefined);
  if (!id) return url ?? null;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;
}
