export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatShortDate(dateStr: string): string {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTimeNow(): string {
  return new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Generates a deterministic 9x9 matrix for rendering a crisp SVG gate-pass QR visual
 * from a 6-digit OTP code without external dependencies.
 */
export function buildQrMatrix(seedStr: string): boolean[][] {
  const size = 11;
  const grid: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );

  // Corner finder markers (3x3)
  const markFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        grid[r0 + r][c0 + c] = !(r === 1 && c === 1) || true;
      }
    }
    grid[r0 + 1][c0 + 1] = true;
  };
  markFinder(0, 0);
  markFinder(0, size - 3);
  markFinder(size - 3, 0);

  let hash = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    hash ^= seedStr.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTopLeft = r < 4 && c < 4;
      const inTopRight = r < 4 && c >= size - 4;
      const inBottomLeft = r >= size - 4 && c < 4;
      if (inTopLeft || inTopRight || inBottomLeft) continue;

      hash ^= (r * 31 + c * 17) & 0xff;
      hash = Math.imul(hash, 16777619);
      grid[r][c] = (hash >>> 0) % 2 === 0;
    }
  }

  return grid;
}
