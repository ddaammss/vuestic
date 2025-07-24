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


