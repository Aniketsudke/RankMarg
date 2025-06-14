import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "./Heatmap.css";
import { CalenderProps } from "@/types/analytics.type";
import { DateFormator } from "@/utils/dateFormator";

const today = new Date();

function Heatmap({ attempts }: { attempts: CalenderProps[] }) {
  const [daysToShow, setDaysToShow] = useState(365);
  const [heatmapData, setHeatmapData] = useState<{ date: string; count: number }[]>([]);
  const [tooltip, setTooltip] = useState<{ date: string; count: number } | null>(null);

  useEffect(() => {
    const generateDateRange = (days: number) => {
      const dates: Record<string, number> = {};
      for (let i = 0; i < days; i++) {
        const date = shiftDate(today, -i).toISOString().split("T")[0];
        dates[date] = 0;
      }
      return dates;
    };

    const allDays = generateDateRange(daysToShow);

    attempts?.forEach((attempt) => {
      const date = new Date(attempt.date).toISOString().split("T")[0];
      allDays[date] = attempt.totalAttempts;
    });

    const formattedData = Object.entries(allDays).map(([date, count]) => ({
      date,
      count: count || 0,
    }));

    setHeatmapData(formattedData);
  }, [attempts, daysToShow]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setDaysToShow(200);
      } else {
        setDaysToShow(365);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <CalendarHeatmap
        startDate={shiftDate(today, -daysToShow)}
        endDate={today}
        values={heatmapData}
        classForValue={(value) => {
          if (!value || value.count === 0) return "color-empty";
          return value.count < 9
            ? `color-github-${Math.min(5, Math.ceil(value.count / 2))}`
            : "color-github-5";
        }}
        showWeekdayLabels={false}
        onClick={(value) => {
          if (value) {
            setTooltip(value);
          }
        }}
      />

      {tooltip && (
        <div className="text-xs tooltip my-1">
          <p>{DateFormator(tooltip.date,"date")}: {tooltip.count} attempt{tooltip.count !== 1 ? 's' : ''}</p>
        </div>
      )}
    </div>
  );
}

function shiftDate(date: Date, numDays: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}

export default Heatmap;
