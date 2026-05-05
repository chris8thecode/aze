export const stripPrefix = (text: string, prefix: string): string =>
  text.startsWith(prefix) ? text.slice(prefix.length) : text

export const tokenize = (text: string): string[] => {
  const tokens: string[] = []
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) tokens.push(m[1] ?? m[2] ?? m[3] ?? '')
  return tokens
}

export const truncate = (text: string, max: number): string =>
  text.length <= max ? text : `${text.slice(0, max - 1)}…`
