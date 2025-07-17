"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Toast } from "@/components/ui/use-toast";

interface Car {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  power: string;
  displacement: string;
  color: string;
  doors: number;
  seats: number;
  images: string[];
  description: string;
  condition: string;
  warranty: string;
  financing: string;
  previous_owners: number;
  accident_free: boolean;
  nonsmoker: boolean;
  first_registration: string;
  last_service: string;
  next_inspection: string;
}

export default function AdminPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    year: "",
    mileage: "",
  });

  useEffect(() => {
    async function fetchCars() {
      const res = await fetch("/api/cars");
      const data = await res.json();
      setCars(data);
    }
    fetchCars();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/cars", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        year: parseInt(form.year),
        mileage: parseInt(form.mileage),
        images: [],
        fuel: "Benzin",
        transmission: "Automatik",
        power: "100 PS",
        displacement: "1.4L",
        color: "Schwarz",
        doors: 5,
        seats: 5,
        description: "Beschreibung folgt",
        condition: "Neu",
        warranty: "12 Monate",
        financing: "Möglich",
        previous_owners: 0,
        accident_free: true,
        nonsmoker: true,
        first_registration: "2024-01",
        last_service: "2024-06",
        next_inspection: "2026-06",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const newCar = await res.json();
    setCars((prev) => [...prev, newCar]);
    setForm({ title: "", price: "", year: "", mileage: "" });
    Toast({ title: "Fahrzeug hinzugefügt!" });
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Adminbereich – Fahrzeuge</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Titel</Label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Preis (€)</Label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Baujahr</Label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Kilometerstand</Label>
            <input
              type="number"
              value={form.mileage}
              onChange={(e) => setForm({ ...form, mileage: e.target.value })}
              required
            />
          </div>
        </div>
        <Button type="submit">Fahrzeug erstellen</Button>
      </form>

      <div className="grid gap-6">
        {cars.map((car) => (
          <Card key={car.id}>
            <CardHeader>
              <CardTitle>{car.title}</CardTitle>
              <CardDescription>
                {car.year} • {car.mileage.toLocaleString()} km • {car.price} €
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{car.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
