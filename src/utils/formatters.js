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
export const formatDateForAPI = (date) => {
  if (!date || !(date instanceof Date)) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
