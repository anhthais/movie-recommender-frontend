import { useTheme } from "@/app/context/theme-provider";

export type RatingIndicatorProps = {
  rating: number;
  cx?: number;
  cy?: number;
  r?: number;
  strokeWidth?: number;
  className?: string;
}

export const RatingIndicator = (props: RatingIndicatorProps) => {
  let { rating } = props;
  const { cx, cy, r, strokeWidth, className } = props;
  if (!rating) rating = 0;
  const { theme } = useTheme();

  return (
    <div className={`relative w-10 h-10 rounded-full shadow-xl  ${className}`}>
      <svg className="w-full h-full rotate-90" viewBox="0 0 36 36">
        <circle
          cx={cx || "18"}
          cy={cy || "18"}
          r={r || "16"}
          fill={theme === "dark" ? "#1F2937" : "#F9FAFB"}
          stroke="#9CA3AF"
          strokeWidth={strokeWidth || "3"}
          className="opacity-70"
        />
        <circle
          cx={cx || "18"}
          cy={cy || "18"}
          r={r || "16"}
          fill="none"
          stroke={
            rating === 0
              ? "#fff"
              : rating * 10 >= 70
              ? "#22c55e"
              : rating * 10 >= 50
              ? "#d97706"
              : "#e11d48"
          }
          stroke-linecap="round"
          strokeWidth={strokeWidth || "3"}
          strokeDasharray="100, 100"
          strokeDashoffset={`${100 - rating * 10}`}
          strokeLinecap="round"
          transform="rotate(-180 18 18)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-primary">
        {rating ? (
          <>
            <span className="font-bold">{`${(rating * 10).toFixed(0)}`}</span>
            <span className="text-[8px]">%</span>
          </>
        ) : (
          <span className="text-[8px]">NR</span>
        )}
      </div>
    </div>
  );
}