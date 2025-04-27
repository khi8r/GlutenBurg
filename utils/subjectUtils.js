// Utility to process book subjects
export function getProcessedSubjects (subjects) {
  return (subjects || [])
    .map(s => {
      const parts = s.split('--')
      return parts[parts.length - 1].trim()
    })
    .filter((v, i, arr) => arr.indexOf(v) === i)
}
