"use client";
import { createContext, useContext } from "react";

interface CalendarContextValue {
  myListOnly: boolean;
  setMyListOnly: (v: boolean) => void;
  ids: Set<number>;
  loggedIn: boolean;
}

export const CalendarContext = createContext<CalendarContextValue>({
  myListOnly: false,
  setMyListOnly: () => {},
  ids: new Set(),
  loggedIn: false,
});

export const useCalendar = () => useContext(CalendarContext);
