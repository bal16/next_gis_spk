"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const SettingsSection = () => {
  const [weights, setWeights] = useState({
    c1: "25",
    c2: "35",
    c3: "20",
    c4: "20",
  });

  const handleSaveWeights = () => {
    const total = Object.values(weights).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);

    if (total !== 100) {
      toast.warning("Peringatan", {
        description: `Total bobot harus 100%. Saat ini: ${total}%`,
      });
      return;
    }

    toast.success("Bobot Disimpan & Kalkulasi Selesai", {
      description: "Bobot baru telah disimpan dan prioritas dihitung ulang (dummy).",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Pengaturan SPK</h2>
        <p className="text-muted-foreground mt-1">
          Kelola bobot kriteria dan kalkulasi prioritas
        </p>
      </div>

      <div className="space-y-8 max-w-2xl">
        {/* Section 1: Bobot */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">1. Pengelolaan Bobot Kriteria (SAW)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="c1">Bobot C1 (Usia)</Label>
              <Input
                id="c1"
                type="number"
                min="0"
                max="100"
                value={weights.c1}
                onChange={(e) => setWeights({ ...weights, c1: e.target.value })}
                className="max-w-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c2">Bobot C2 (Kondisi Fisik)</Label>
              <Input
                id="c2"
                type="number"
                min="0"
                max="100"
                value={weights.c2}
                onChange={(e) => setWeights({ ...weights, c2: e.target.value })}
                className="max-w-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c3">Bobot C3 (Tingkat Utilitas)</Label>
              <Input
                id="c3"
                type="number"
                min="0"
                max="100"
                value={weights.c3}
                onChange={(e) => setWeights({ ...weights, c3: e.target.value })}
                className="max-w-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c4">Bobot C4 (Dampak Kerusakan)</Label>
              <Input
                id="c4"
                type="number"
                min="0"
                max="100"
                value={weights.c4}
                onChange={(e) => setWeights({ ...weights, c4: e.target.value })}
                className="max-w-[150px]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Kalkulasi */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">2. Aksi</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Total Bobot:{" "}
                <span className="font-semibold text-foreground">
                  {Object.values(weights).reduce((sum, value) => sum + (parseFloat(value) || 0), 0)}%
                </span>
              </div>
              <Button onClick={handleSaveWeights}>
                Simpan Bobot & Hitung Ulang Prioritas
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Kalkulasi terakhir dilakukan pada: <span className="font-medium">23 Oktober 2025, 14:30</span> oleh <span className="font-medium">Admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
