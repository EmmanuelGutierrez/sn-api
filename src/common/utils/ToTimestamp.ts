export const toTimestamp = (date: string | Date) => {
  return Math.floor(new Date(date).getTime() / 1000);
};
