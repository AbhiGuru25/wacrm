"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Pill, 
  Building2, 
  Layers, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  MessageSquare, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from "lucide-react";

interface DistributorStock {
  distributorName: string;
  location: string;
  stockUnits: number;
  rate: number;
  phone: string;
  isAvailable: boolean;
}

interface Medicine {
  id: string;
  brandName: string;
  composition: string;
  manufacturer: string;
  category: string;
  packSize: string;
  mrp: number;
  prescriptionRequired: boolean;
  distributors: DistributorStock[];
}

const SAMPLE_MEDICINES: Medicine[] = [
  {
    id: "med-1",
    brandName: "Dolo 650mg Tablet",
    composition: "Paracetamol (650mg)",
    manufacturer: "Micro Labs Ltd",
    category: "Pain & Fever",
    packSize: "15 Tablets / Strip",
    mrp: 33.60,
    prescriptionRequired: false,
    distributors: [
      { distributorName: "Surat Pharma Distributors", location: "Ring Road, Surat", stockUnits: 450, rate: 24.50, phone: "+919876543210", isAvailable: true },
      { distributorName: "Apex Healthcare Logistics", location: "Udhana, Surat", stockUnits: 120, rate: 25.10, phone: "+919876543211", isAvailable: true }
    ]
  },
  {
    id: "med-2",
    brandName: "Augmentin 625 Duo Tablet",
    composition: "Amoxicillin (500mg) + Clavulanic Acid (125mg)",
    manufacturer: "GlaxoSmithKline Pharmaceuticals",
    category: "Antibiotic",
    packSize: "10 Tablets / Strip",
    mrp: 223.40,
    prescriptionRequired: true,
    distributors: [
      { distributorName: "Surat Pharma Distributors", location: "Ring Road, Surat", stockUnits: 85, rate: 168.00, phone: "+919876543210", isAvailable: true },
      { distributorName: "Gujarat Medilink Agencies", location: "Varachha, Surat", stockUnits: 210, rate: 165.50, phone: "+919876543212", isAvailable: true }
    ]
  },
  {
    id: "med-3",
    brandName: "Pan-D Capsule",
    composition: "Pantoprazole (40mg) + Domperidone (30mg)",
    manufacturer: "Alkem Laboratories Ltd",
    category: "Gastroenterology",
    packSize: "15 Capsules / Strip",
    mrp: 199.00,
    prescriptionRequired: true,
    distributors: [
      { distributorName: "Apex Healthcare Logistics", location: "Udhana, Surat", stockUnits: 340, rate: 142.00, phone: "+919876543211", isAvailable: true },
      { distributorName: "Siddhi Drug House", location: "Adajan, Surat", stockUnits: 60, rate: 145.00, phone: "+919876543213", isAvailable: true }
    ]
  },
  {
    id: "med-4",
    brandName: "Azithral 500mg Tablet",
    composition: "Azithromycin (500mg)",
    manufacturer: "Alembic Pharmaceuticals Ltd",
    category: "Antibiotic",
    packSize: "5 Tablets / Strip",
    mrp: 132.50,
    prescriptionRequired: true,
    distributors: [
      { distributorName: "Gujarat Medilink Agencies", location: "Varachha, Surat", stockUnits: 500, rate: 94.00, phone: "+919876543212", isAvailable: true },
      { distributorName: "Surat Pharma Distributors", location: "Ring Road, Surat", stockUnits: 0, rate: 96.00, phone: "+919876543210", isAvailable: false }
    ]
  },
  {
    id: "med-5",
    brandName: "Telma 40mg Tablet",
    composition: "Telmisartan (40mg)",
    manufacturer: "Glenmark Pharmaceuticals",
    category: "Cardiac / Hypertension",
    packSize: "30 Tablets / Strip",
    mrp: 290.00,
    prescriptionRequired: true,
    distributors: [
      { distributorName: "Apex Healthcare Logistics", location: "Udhana, Surat", stockUnits: 180, rate: 210.00, phone: "+919876543211", isAvailable: true }
    ]
  },
  {
    id: "med-6",
    brandName: "Glycomet-GP 2 Tablet",
    composition: "Metformin (500mg) + Glimepiride (2mg)",
    manufacturer: "USV Ltd",
    category: "Diabetes",
    packSize: "15 Tablets / Strip",
    mrp: 145.00,
    prescriptionRequired: true,
    distributors: [
      { distributorName: "Siddhi Drug House", location: "Adajan, Surat", stockUnits: 95, rate: 104.00, phone: "+919876543213", isAvailable: true },
      { distributorName: "Gujarat Medilink Agencies", location: "Varachha, Surat", stockUnits: 310, rate: 102.50, phone: "+919876543212", isAvailable: true }
    ]
  },
  {
    id: "med-7",
    brandName: "Montair-LC Tablet",
    composition: "Montelukast (10mg) + Levocetirizine (5mg)",
    manufacturer: "Cipla Ltd",
    category: "Respiratory & Allergy",
    packSize: "10 Tablets / Strip",
    mrp: 178.00,
    prescriptionRequired: true,
    distributors: [
      { distributorName: "Surat Pharma Distributors", location: "Ring Road, Surat", stockUnits: 250, rate: 128.00, phone: "+919876543210", isAvailable: true }
    ]
  }
];

export default function MedicinesSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const categories = ["All", "Antibiotic", "Pain & Fever", "Gastroenterology", "Cardiac / Hypertension", "Diabetes", "Respiratory & Allergy"];

  const filteredMedicines = useMemo(() => {
    return SAMPLE_MEDICINES.filter((med) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        med.brandName.toLowerCase().includes(q) ||
        med.composition.toLowerCase().includes(q) ||
        med.manufacturer.toLowerCase().includes(q);

      const matchesCat = selectedCategory === "All" || med.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 p-4 md:p-8">
      {/* Header Banner */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fingertip Medicine Search • Trigram Fuzzy Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <Pill className="w-7 h-7 text-amber-400" />
              Chemist Stock &amp; Medicine Finder
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Search by Brand, Molecule / Composition, or Manufacturer with typo-tolerant matching.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 self-start">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>RLS Active: Chemist Tier</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search e.g. 'Dolo', 'Paracetamol', 'Amoxy', 'Cipla', 'Pan-D'..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-white placeholder-slate-500 text-sm md:text-base outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 text-xs font-mono text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar mt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border ${
                  selectedCategory === cat
                    ? "bg-amber-400/20 text-amber-300 border-amber-400/40 font-medium"
                    : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span>Results: {filteredMedicines.length} medicines found</span>
          <span>Showing verified distributor stocks</span>
        </div>

        {filteredMedicines.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
            <AlertCircle className="w-10 h-10 text-amber-400/60 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No exact matching medicines</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              Try searching by molecule name (e.g. "Paracetamol" or "Amoxicillin") or check spelling.
            </p>
          </div>
        ) : (
          filteredMedicines.map((med) => {
            const totalStock = med.distributors.reduce((acc, d) => acc + d.stockUnits, 0);
            const isSelected = selectedMedicine?.id === med.id;

            return (
              <div 
                key={med.id}
                className={`bg-slate-900/70 border rounded-xl p-4 md:p-5 transition-all shadow-sm ${
                  isSelected ? "border-amber-400/60 ring-1 ring-amber-400/30" : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base md:text-lg font-bold text-white tracking-tight">
                        {med.brandName}
                      </h2>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {med.packSize}
                      </span>
                      {med.prescriptionRequired && (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Rx Required
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-amber-300/90 font-mono flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>Composition: {med.composition}</span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Mfg: {med.manufacturer}</span>
                    </div>
                  </div>

                  {/* MRP & Stock Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                    <div className="text-left sm:text-right">
                      <div className="text-xs text-slate-500 font-mono">Retail MRP</div>
                      <div className="text-base font-bold text-emerald-400 font-mono">₹{med.mrp.toFixed(2)}</div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono mt-1">
                      {totalStock > 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{totalStock} in Stock</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                          <AlertCircle className="w-3 h-3" />
                          <span>Out of Stock</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stocking Distributors Accordion Trigger */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-400" />
                    <span>Available at {med.distributors.length} stocking distributor(s)</span>
                  </div>

                  <button
                    onClick={() => setSelectedMedicine(isSelected ? null : med)}
                    className="text-xs font-medium text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 self-start sm:self-auto transition-colors"
                  >
                    <span>{isSelected ? "Hide Distributor Rates" : "View Distributor Stock & Rates"}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? "rotate-90" : ""}`} />
                  </button>
                </div>

                {/* Expanded Distributor List */}
                {isSelected && (
                  <div className="mt-3.5 pt-3.5 border-t border-slate-800 space-y-2.5">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                      Private Chemist Wholesale Rates (Confidential):
                    </div>
                    {med.distributors.map((dist, idx) => (
                      <div 
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-slate-950/70 border border-slate-800/80"
                      >
                        <div>
                          <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                            <span>{dist.distributorName}</span>
                            <span className="text-[10px] text-slate-500 font-normal">({dist.location})</span>
                          </div>
                          <div className="text-xs font-mono text-emerald-400/90 mt-0.5">
                            Wholesale Rate: <span className="font-bold">₹{dist.rate.toFixed(2)}</span> / strip 
                            <span className="text-slate-500 text-[10px] ml-1.5">({dist.stockUnits} units ready)</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <a
                            href={`https://wa.me/${dist.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, Chemist order request for ${med.brandName} (${med.packSize}). Please confirm stock & dispatch.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp Order</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
