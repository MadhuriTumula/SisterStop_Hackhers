import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Table2 } from "lucide-react";
import type { PulsePoint, SupportTypeSlice } from "../types/api";
import { SUPPORT_TYPE_LABEL } from "../lib/formatters";

/**
 * Aggregate-only visuals. Requests and mood are never plotted on one pair of
 * axes — mood is a stat tile on the page, so this chart keeps a single scale.
 * Palette: validated categorical steps for a dark surface (#11172A).
 */
const SURFACE = "#11172A";
const GRID = "#24304F";
const AXIS_TEXT = "#94A3B8";
const SERIES = "#3987e5";
const CATEGORICAL = ["#3987e5", "#d95926", "#199e70", "#c98500"];

interface CommunityPulseChartProps {
  data: PulsePoint[];
  bySupportType: SupportTypeSlice[];
}

/** Value label drawn at the end of each bar — direct labels, not a legend. */
const BarValueLabel = (props: {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  value?: number | string;
}) => {
  const x = Number(props.x ?? 0);
  const y = Number(props.y ?? 0);
  const width = Number(props.width ?? 0);
  const height = Number(props.height ?? 0);

  return (
    <text
      x={x + width + 8}
      y={y + height / 2}
      dy={4}
      fill={AXIS_TEXT}
      fontSize={11}
      textAnchor="start"
    >
      {props.value}
    </text>
  );
};

interface TooltipEntry {
  value?: number | string;
  payload?: { time?: string; requests?: number };
}

const RequestsTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
}) => {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;

  return (
    <div className="rounded-xl border border-hairline bg-elevated px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-paper">{point?.time}</p>
      <p className="mt-0.5 text-muted">
        <span
          className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
          style={{ background: SERIES }}
          aria-hidden="true"
        />
        {point?.requests} support requests
      </p>
    </div>
  );
};

const CommunityPulseChart = ({ data, bySupportType }: CommunityPulseChartProps) => {
  const [showTable, setShowTable] = useState(false);

  // Multiple routes can land in the same 30-minute bucket; the chart shows
  // total demand per window, never a single rider's trip.
  const byWindow = useMemo(() => {
    const totals = new Map<string, number>();
    data.forEach((point) => {
      totals.set(point.time, (totals.get(point.time) ?? 0) + point.requests);
    });
    return Array.from(totals, ([time, requests]) => ({ time, requests }));
  }, [data]);

  const splits = useMemo(
    () =>
      [...bySupportType]
        .sort((a, b) => b.count - a.count)
        .map((slice) => ({
          ...slice,
          label: SUPPORT_TYPE_LABEL[slice.supportType] ?? slice.supportType,
        })),
    [bySupportType],
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="card p-5">
        <div className="mb-1 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Support requests by 30-minute window</h2>
            <p className="mt-1 text-xs text-muted">
              Anonymous check-ins across all routes, last 12 hours.
            </p>
          </div>
          <button
            type="button"
            className="btn-ghost h-8 px-3 text-xs"
            aria-pressed={showTable}
            onClick={() => setShowTable((value) => !value)}
          >
            <Table2 className="h-3.5 w-3.5" aria-hidden="true" />
            {showTable ? "Chart" : "Table"}
          </button>
        </div>

        {showTable ? (
          <table className="mt-4 w-full text-left text-sm">
            <caption className="sr-only">Support requests per 30-minute window</caption>
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted">
                <th scope="col" className="py-2">Window</th>
                <th scope="col" className="py-2 text-right">Requests</th>
              </tr>
            </thead>
            <tbody>
              {byWindow.map((row) => (
                <tr key={row.time} className="border-t border-hairline/60">
                  <th scope="row" className="py-2 font-normal">{row.time}</th>
                  <td className="py-2 text-right tabular-nums">{row.requests}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={byWindow} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <defs>
                  <linearGradient id="requestsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={SERIES} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={SERIES} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fill: AXIS_TEXT, fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: GRID }}
                  interval="preserveStartEnd"
                  minTickGap={16}
                />
                <YAxis
                  tick={{ fill: AXIS_TEXT, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<RequestsTooltip />}
                  cursor={{ stroke: AXIS_TEXT, strokeDasharray: "4 4" }}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke={SERIES}
                  strokeWidth={2}
                  fill="url(#requestsFill)"
                  dot={{ r: 3, fill: SERIES, stroke: SURFACE, strokeWidth: 2 }}
                  activeDot={{ r: 5, stroke: SURFACE, strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="card p-5">
        <h2 className="text-base font-semibold">Which support riders chose</h2>
        <p className="mt-1 text-xs text-muted">
          Share of anonymous check-ins by support type, last 7 days.
        </p>

        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={splits}
              layout="vertical"
              margin={{ top: 4, right: 36, bottom: 0, left: 8 }}
              barCategoryGap={10}
            >
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fill: AXIS_TEXT, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={104}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                {splits.map((slice, index) => (
                  <Cell
                    key={slice.supportType}
                    fill={CATEGORICAL[index % CATEGORICAL.length]}
                    stroke={SURFACE}
                    strokeWidth={2}
                  />
                ))}
                <LabelList dataKey="count" content={<BarValueLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="mt-2 text-xs text-muted">
          Each bar is labelled directly, so the categories never depend on color alone.
        </p>
      </section>
    </div>
  );
};

export default CommunityPulseChart;
