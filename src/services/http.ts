export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
  }
}

export const getJson = async <T>(url: string, init: RequestInit = {}): Promise<T> => {
  const res = await fetch(url, {
    ...init,
    headers: { accept: 'application/json', ...(init.headers ?? {}) }
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new HttpError(res.status, `${res.status} ${res.statusText} — ${body.slice(0, 200)}`)
  }
  return (await res.json()) as T
}

export const getBuffer = async (url: string): Promise<{ data: Buffer; mime: string }> => {
  const res = await fetch(url)
  if (!res.ok) throw new HttpError(res.status, `${res.status} ${res.statusText}`)
  const mime = res.headers.get('content-type') ?? 'application/octet-stream'
  const data = Buffer.from(await res.arrayBuffer())
  return { data, mime }
}
