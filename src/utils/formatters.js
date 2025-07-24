export const formatNumber = (value) => {
  try {
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num)) return '0'
    return num.toLocaleString('ko-KR')
  } catch (error) {
    return '0'
  }
}

export const formatCurrency = (amount) => {
  return `${amount.toLocaleString()}원`
}

export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return ''

  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    case 'MM/DD':
      return `${month}/${day}`
    default:
      return `${year}-${month}-${day}`
  }
}

export const formatDateTime = (date) => {
  if (!date) return ''

  const d = new Date(date)
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
