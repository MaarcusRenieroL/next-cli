"use client";

import { useMemo, useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";

type ChangelogGroup = {
  title: string;
  items: string[];
};

export type ChangelogEntry = {
  version: string;
  date?: string;
  month: string;
  summary: string;
  groups: ChangelogGroup[];
};

type ChangelogListProps = {
  changes: ChangelogEntry[];
};

const latestValue = "latest";
const allMonthsValue = "all";

export function ChangelogList({ changes }: ChangelogListProps) {
  const [selectedVersion, setSelectedVersion] = useState(latestValue);
  const [selectedMonth, setSelectedMonth] = useState(allMonthsValue);

  const months = useMemo(
    () => Array.from(new Set(changes.map(change => change.month))),
    [changes]
  );

  const visibleChanges = useMemo(() => {
    const baseChanges =
      selectedVersion === latestValue
        ? changes.slice(0, 1)
        : changes.filter(change => change.version === selectedVersion);

    if (selectedMonth === allMonthsValue) {
      return baseChanges;
    }

    return baseChanges.filter(change => change.month === selectedMonth);
  }, [changes, selectedMonth, selectedVersion]);

  return (
    <div className="mt-8 max-w-3xl">
      <Card className="mb-8 border-white/10 bg-white/[0.03] text-white shadow-none">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="grid gap-2 text-sm font-medium text-zinc-200">
            <span id="changelog-version-filter">Version</span>
            <Select value={selectedVersion} onValueChange={setSelectedVersion}>
              <SelectTrigger
                aria-labelledby="changelog-version-filter"
                className="border-white/10 bg-zinc-950 text-white focus:ring-indigo-400"
              >
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-zinc-950 text-white">
                <SelectItem value={latestValue}>Latest changelog</SelectItem>
                {changes.map(change => (
                  <SelectItem key={change.version} value={change.version}>
                    {change.version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2 text-sm font-medium text-zinc-200">
            <span id="changelog-month-filter">Month</span>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger
                aria-labelledby="changelog-month-filter"
                className="border-white/10 bg-zinc-950 text-white focus:ring-indigo-400"
              >
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-zinc-950 text-white">
                <SelectItem value={allMonthsValue}>All months</SelectItem>
                {months.map(month => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSelectedVersion(latestValue);
              setSelectedMonth(allMonthsValue);
            }}
            className="border-white/10 bg-transparent text-zinc-200 hover:border-indigo-400 hover:bg-white/[0.06] hover:text-white"
          >
            Reset
          </Button>
        </CardContent>
      </Card>

      {visibleChanges.length > 0 ? (
        <div className="space-y-8">
          {visibleChanges.map(change => (
            <section
              key={change.version}
              className="border-t border-white/10 pt-7 first:border-t-0 first:pt-0"
            >
              <div className="mb-4">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  {change.version}
                </h2>
                <p className="mt-1 text-sm font-medium text-indigo-300">
                  {change.date ?? change.month}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {change.summary}
                </p>
              </div>

              <div className="space-y-5">
                {change.groups.map(group => (
                  <div key={group.title}>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-300">
                      {group.title}
                    </h3>
                    <ul className="space-y-2 text-sm leading-relaxed text-zinc-400">
                      {group.items.map(item => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <Card className="border-white/10 bg-white/[0.03] text-zinc-400 shadow-none">
          <CardContent className="p-5 text-sm">
            No changelog entries match those filters.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
