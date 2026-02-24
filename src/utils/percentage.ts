/**
 * Menghitung persentase perubahan antara dua nilai
 * @param current Nilai sekarang
 * @param previous Nilai sebelumnya
 * @returns Persentase perubahan (bisa positif atau negatif)
 */
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0
  }
  
  return Number(((current - previous) / previous * 100).toFixed(1))
}

/**
 * Mendapatkan arah trend berdasarkan nilai persentase
 * @param percentage Nilai persentase
 * @returns 'up' jika positif, 'down' jika negatif
 */
export const getTrendDirection = (percentage: number): 'up' | 'down' => {
  return percentage >= 0 ? 'up' : 'down'
}

/**
 * Memformat persentase dengan tanda + atau -
 * @param percentage Nilai persentase
 * @returns String terformat (contoh: "+12.5%" atau "-8.3%")
 */
export const formatPercentage = (percentage: number): string => {
  const sign = percentage > 0 ? '+' : ''
  return `${sign}${percentage.toFixed(1)}%`
}