export const formatZAR = (amount) => {
  if (!amount) return "R 0.00"

  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2
  }).format(amount)
}