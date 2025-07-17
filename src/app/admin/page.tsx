"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import { Toast } from "@/components/ui/use-toast";

interface Car {
  id: number;
  title: string;
  price: number;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  images: string[];
  features: string[];
}

export default function AdminPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    year: "",
    mileage: "",
    fuel: "",
    transmission: "",
    images: "",
    features: "",
  });

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      Toast({
        title: "Fehler beim Laden der Autos",
      });
    } else {
      setCars(data as Car[]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newCar = {
      title: form.title,
      price: parseInt(form.price),
      year: parseInt(form.year),
      mileage: parseInt(form.mileage),
      fuel: form.fuel,
      transmission: form.transmission,
      images: form.images.split(",").map((img) => img.trim()),
      features: form.features.split(",").map((f) => f.trim()),
    };

    const { error } = await supabase.from("cars").insert([newCar]);

    if (error) {
      Toast({ title: "Fehler" });
    } else {
      Toast({ title: "Auto hinzugefügt" });
      setForm({
        title: "",
        price: "",
        year: "",
        mileage: "",
        fuel: "",
        transmission: "",
        images: "",
        features: "",
      });
      fetchCars(); // Refresh the list
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🚗 Fahrzeugverwaltung</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Titel", name: "title" },
          { label: "Preis", name: "price" },
          { label: "Baujahr", name: "year" },
          { label: "Kilometerstand", name: "mileage" },
          { label: "Kraftstoff", name: "fuel" },
          { label: "Getriebe", name: "transmission" },
        ].map((field) => (
          <div key={field.name}>
            <Label>{field.label}</Label>
            <input
              required
              value={(form as any)[field.name]}
              onChange={(e) =>
                setForm({ ...form, [field.name]: e.target.value })
              }
            />
          </div>
        ))}

        <div>
          <Label>Bilder (kommagetrennt)</Label>
          <Textarea
            required
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
            placeholder="https://image1.jpg, https://image2.jpg"
          />
        </div>

        <div>
          <Label>Ausstattung (kommagetrennt)</Label>
          <Textarea
            required
            value={form.features}
            onChange={(e) => setForm({ ...form, features: e.target.value })}
            placeholder="Navi, Klimaautomatik, Xenon"
          />
        </div>

        <Button type="submit">Fahrzeug speichern</Button>
      </form>

      <hr className="my-10" />

      <h2 className="text-xl font-semibold mb-4">🚘 Bestehende Fahrzeuge</h2>
      <ul className="space-y-2">
        {cars.map((car) => (
          <li key={car.id} className="border p-3 rounded">
            <div className="font-bold">{car.title}</div>
            <div className="text-sm text-gray-600">
              {car.year} • {car.fuel} • {car.transmission} •{" "}
              {car.price.toLocaleString("de-DE")} €
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
