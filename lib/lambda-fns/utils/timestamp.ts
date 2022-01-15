const dateISOString = (date: Date) => {
  return `${date.toISOString().split('T')[0]}`
}

export const createDateTimestamp = (): string => {
  // initial data definition
  const today = new Date();

  return dateISOString(today)
}