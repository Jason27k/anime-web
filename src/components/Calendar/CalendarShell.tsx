"use client";
import { useState } from "react";
import { CalendarContext } from "./CalendarContext";

const CalendarShell = ({
  loggedIn,
  ids,
  children,
}: {
  loggedIn: boolean;
  ids: number[];
  children: React.ReactNode;
}) => {
  const [myListOnly, setMyListOnly] = useState(false);
  const idSet = new Set(ids);

  return (
    <CalendarContext.Provider value={{ myListOnly, setMyListOnly, ids: idSet, loggedIn }}>
      <div className="flex flex-col w-full">
        <header className="mb-16">
          <div className="flex items-baseline gap-4 mb-2">
            <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase">
              Schedule
            </span>
            <div className="h-px flex-grow bg-gradient-to-r from-primary/30 to-transparent" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-4">
            WEEKLY PREMIERES
          </h1>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
              All times are displayed in your local timezone.
            </p>
            {loggedIn && ids.length > 0 && (
              <button
                onClick={() => setMyListOnly((v) => !v)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                  myListOnly
                    ? "bg-primary text-on-primary border-primary"
                    : "bg-transparent text-muted-foreground border-outline-variant hover:text-foreground hover:border-primary/50"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    myListOnly ? "bg-on-primary" : "bg-muted-foreground"
                  }`}
                />
                My List Only
              </button>
            )}
          </div>
        </header>

        <div className="space-y-4">{children}</div>
      </div>
    </CalendarContext.Provider>
  );
};

export default CalendarShell;
