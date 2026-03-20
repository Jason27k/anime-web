import { Suspense } from "react";
import CalendarContent from "@/components/Calendar/CalendarContent";
import CalendarLoadingPage from "./loading";

export const maxDuration = 30;

const WeeklyCalendar = () => {
  return (
    <div>
      <Suspense fallback={<CalendarLoadingPage />}>
        <CalendarContent />
      </Suspense>
    </div>
  );
};

export default WeeklyCalendar;
