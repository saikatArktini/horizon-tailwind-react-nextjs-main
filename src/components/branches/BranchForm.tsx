"use client";

import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import InputField from "components/fields/InputField";
import Dropdown from "components/dropdown";
import Radio from "components/radio";
import { useRouter } from 'next/navigation';
//import { Router } from "next/router";

type Option = { id: number; name: string };

type BranchFormProps = {
  mode?: "create" | "edit";
  initialData?: {
    id: number;
    branchName: string;
    branchCode: string;
    city: string;
    address: string;
    countryId: number;
    stateId: number;
    branchLevelId: number;
    geoFencingEnabled: boolean;
  };
};

export default function BranchForm({
  mode = "create",
  initialData,
}: BranchFormProps) {
  const isEdit = mode === "edit";
  const router = useRouter();
  // FORM STATE
  const [branchName, setBranchName] = useState("");
  const [branchCode, setBranchCode] = useState("AUTO-GENERATED");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [geoFence, setGeoFence] = useState<boolean | null>(null);

  // MASTER DATA
  const [countries, setCountries] = useState<Option[]>([]);
  const [states, setStates] = useState<Option[]>([]);
  const [branchLevels, setBranchLevels] = useState<Option[]>([]);

  // SELECTED IDS
  const [countryId, setCountryId] = useState<number | null>(null);
  const [stateId, setStateId] = useState<number | null>(null);
  const [branchLevelId, setBranchLevelId] = useState<number | null>(null);

  /* 🔹 Load master data */
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/countries", { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).then(setCountries);
    fetch("/api/branch-levels", { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).then(setBranchLevels);
  }, []);

  /* 🔹 Pre-fill data (EDIT MODE) */
  useEffect(() => {
    if (!initialData) return;

    setBranchName(initialData.branchName);
    setBranchCode(initialData.branchCode);
    setCity(initialData.city);
    setAddress(initialData.address);
    setCountryId(initialData.countryId);
    setStateId(initialData.stateId);
    setBranchLevelId(initialData.branchLevelId);
    setGeoFence(initialData.geoFencingEnabled);
  }, [initialData]);

  /* 🔹 Load states on country change */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!countryId) return;
    fetch(`/api/countries/${countryId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setStates);
  }, [countryId]);

  /* 🔹 Preview branch code (CREATE only) */
  useEffect(() => {
    if (mode === "edit") return;

    if (!countryId || !branchLevelId || !stateId) {
      setBranchCode("AUTO-GENERATED");
      return;
    }

    setBranchCode(`BR-${countryId}-${branchLevelId}-${stateId}-XXXX`);
  }, [countryId, branchLevelId, stateId, mode]);

  /* 🔹 Submit */
  async function handleSubmit() {
    const token = localStorage.getItem("token");
    if (!countryId || !stateId || !branchLevelId) {
      alert("Please select all dropdowns");
      return;
    }

    try {
      const url =
        mode === "edit"
          ? `/api/branches/${initialData?.id}`
          : "/api/branches";

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          branchName,
          city,
          address,
          countryId,
          stateId,
          branchLevelId,
          geoFencingEnabled: geoFence,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Something went wrong");
        return;
      }

      alert(result.message || "Success");

      if (mode === "create") {
        setBranchName("");
        setBranchCode("AUTO-GENERATED");
        setCity("");
        setAddress("");
        setCountryId(null);
        setStateId(null);
        setBranchLevelId(null);
        setGeoFence(null);
      }
      if (mode === "edit") {
        router.push(`/admin/branch`);
      }
    } catch {
      alert("Network error. Please try again.");
    }
  }

  return (
    <div className="bg-white rounded-xl border p-6 space-y-6">
      {/* BASIC DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          id="branchName"
          label="Branch Name"
          value={branchName}
          placeholder="Enter branch name"
          onChange={e => setBranchName(e.target.value)}
        />

        <InputField
          id="branchCode"
          label="Branch Code"
          value={branchCode}
          placeholder=""
          disabled
        />

        <InputField
          id="city"
          label="City"
          value={city}
          placeholder="Enter City"
          onChange={e => setCity(e.target.value)}
        />

        {/* BRANCH LEVEL */}
        <div>
          <label className="ml-3 text-sm font-bold">Branch Level</label>
          <Dropdown
            classNames="top-14 w-full rounded-xl border bg-white p-2"
            button={
              <button className="mt-2 h-12 w-full rounded-xl border px-3 text-left" disabled={isEdit}>
                {branchLevels.find(b => b.id === branchLevelId)?.name ||
                  "Select branch level"}
              </button>
            }
          >
            <div className="flex flex-col">
              {branchLevels.map(level => (
                <button
                  key={level.id}
                  className="p-2 hover:bg-gray-100 text-left"
                  onClick={() => setBranchLevelId(level.id)}
                >
                  {level.name}
                </button>
              ))}
            </div>
          </Dropdown>
        </div>
      </div>

      {/* COUNTRY & STATE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="ml-3 text-sm font-bold">Country</label>
          <Dropdown
            classNames="top-14 w-full rounded-xl border bg-white p-2"
            button={
              <button className="mt-2 h-12 w-full rounded-xl border px-3 text-left" disabled={isEdit}>
                {countries.find(c => c.id === countryId)?.name ||
                  "Select country"}
              </button>
            }
          >
            <div className="flex flex-col">
              {countries.map(country => (
                <button
                  key={country.id}
                  className="p-2 hover:bg-gray-100 text-left"
                  onClick={() => {
                    setCountryId(country.id);
                    setStateId(null);
                  }}
                >
                  {country.name}
                </button>
              ))}
            </div>
          </Dropdown>
        </div>

        <div>
          <label className="ml-3 text-sm font-bold">State</label>
          <Dropdown
            classNames="top-14 w-full rounded-xl border bg-white p-2"
            button={
              <button className="mt-2 h-12 w-full rounded-xl border px-3 text-left" disabled={isEdit}>
                {states.find(s => s.id === stateId)?.name || "Select state"}
              </button>
            }
          >
            <div className="flex flex-col">
              {states.map(state => (
                <button
                  key={state.id}
                  className="p-2 hover:bg-gray-100 text-left"
                  onClick={() => setStateId(state.id)}
                >
                  {state.name}
                </button>
              ))}
            </div>
          </Dropdown>
        </div>
      </div>

      {/* ADDRESS */}
      <InputField
        id="address"
        label="Full Address"
        value={address}
        placeholder="Enter full address"
        onChange={e => setAddress(e.target.value)}
        extra="w-full"
      />

      {/* GEO FENCING */}
      <div>
        <label className="ml-3 text-sm font-bold block mb-2">
          Enable Geo Fencing
        </label>

        <div className="flex gap-6 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <Radio checked={geoFence === true} onChange={() => setGeoFence(true)} />
            Yes
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <Radio checked={geoFence === false} onChange={() => setGeoFence(false)} />
            No
          </label>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outlined">Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {mode === "edit" ? "Update Branch" : "Create Branch"}
        </Button>
      </div>
    </div>
  );
}
