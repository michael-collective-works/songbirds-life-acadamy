type LogLevel = 'info' | 'warn' | 'error'

function base() {
  return {
    ts: new Date().toISOString(),
  }
}

export function log(level: LogLevel, msg: string, meta?: Record<string, any>) {
  const payload = { ...base(), level, msg, ...(meta || {}) }
  const line = JSON.stringify(payload)
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)
}
