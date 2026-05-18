"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Props = {
  categories: { id: string; name: string }[];
  defaults: { q?: string; category?: string; from?: string; to?: string };
};

export function ReceiptFilters({ categories, defaults }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(defaults.q ?? "");
  const [category, setCategory] = useState(defaults.category ?? "");
  const [from, setFrom] = useState(defaults.from ?? "");
  const [to, setTo] = useState(defaults.to ?? "");

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    setOrDelete(next, "q", q);
    setOrDelete(next, "category", category);
    setOrDelete(next, "from", from);
    setOrDelete(next, "to", to);
    router.push(`/receipts?${next.toString()}`);
  }

  function clear() {
    setQ("");
    setCategory("");
    setFrom("");
    setTo("");
    router.push("/receipts");
  }

  return (
    <form
      onSubmit={apply}
      className="grid gap-3 rounded-md border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      <div className="space-y-1">
        <Label htmlFor="q">Search merchant</Label>
        <Input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Apple" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="category">Category</Label>
        <Select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="from">From</Label>
        <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="to">To</Label>
        <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div className="flex items-end gap-2">
        <Button type="submit" className="flex-1">
          Apply
        </Button>
        <Button type="button" variant="ghost" onClick={clear}>
          Clear
        </Button>
      </div>
    </form>
  );
}

function setOrDelete(p: URLSearchParams, key: string, value: string) {
  if (value && value.length > 0) p.set(key, value);
  else p.delete(key);
}
