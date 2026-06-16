const KEY = 'lab_reports'

export function getReports() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function getReport(id) {
  return getReports().find(r => r.id === Number(id)) || null
}

export function saveReport(report) {
  const reports = getReports()
  const saved = { ...report, id: report.id || Date.now() }
  const idx = reports.findIndex(r => r.id === saved.id)
  if (idx >= 0) reports[idx] = saved
  else reports.unshift(saved)
  localStorage.setItem(KEY, JSON.stringify(reports))
  return saved
}

export function deleteReport(id) {
  const reports = getReports().filter(r => r.id !== Number(id))
  localStorage.setItem(KEY, JSON.stringify(reports))
}
