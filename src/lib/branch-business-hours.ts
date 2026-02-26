import { OpeningHours } from "./types";

export function formatBusinessHours(hours: OpeningHours | undefined): string {
  if (!hours) return "Hours not available";

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const today = new Date().getDay();
  const todayHours = hours[dayNames[today].toLowerCase() as keyof OpeningHours];

  if (todayHours?.closed) {
    return "Closed today";
  }

  if (todayHours) {
    return `Open ${todayHours.open} - ${todayHours.close}`;
  }

  return "Hours not available";
}

export function getTodayHours(hours: OpeningHours | undefined) {
  if (!hours) return null;

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const today = new Date().getDay();
  return hours[dayNames[today].toLowerCase() as keyof OpeningHours];
}

export function isBranchOrderingAvailable(hours: OpeningHours | undefined): boolean {
  const todayHours = getTodayHours(hours);
  if (!todayHours || todayHours.closed) {
    return false;
  }

  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
}

export function getBranchNextOpeningTime(hours: OpeningHours | undefined): string {
  if (!hours) return "Not available";

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const today = new Date().getDay();
  const daysFromNow = 0;

  let checkDate = new Date();
  checkDate.setDate(checkDate.getDate() + daysFromNow);

  // Check today and next 6 days
  for (let i = 0; i < 7; i++) {
    const checkDay = new Date(checkDate);
    checkDay.setDate(checkDate.getDate() + i);
    const dayName = dayNames[checkDay.getDay()];
    const dayHours = hours[dayName.toLowerCase() as keyof OpeningHours];

    if (dayHours && !dayHours.closed) {
      if (i === 0) {
        // Check if it's today and still open
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5);
        if (currentTime >= dayHours.open && currentTime <= dayHours.close) {
          return "Open now";
        }
      }
      return `Opens ${dayHours.open} ${dayName}`;
    }
  }

  return "Closed";
}