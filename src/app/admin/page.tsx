"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import supabase, { isSupabaseConfigured } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Car, Plus, Edit, Trash2, Save, Shield, Lock, Eye } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import { moveImagesToCarFolder } from "@/lib/storage";

// ----------------------
// Types
// ----------------------
export interface CarData {
  id: string; // UUID
  brand: string;
  model: string;
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
  equipment: {
    comfort: string[];
    safety: string[];
    multimedia: string[];
    exterior: string[];
    engineTransmission: string[];
  };
  description: string;
  condition: string;
  warranty: string;
  financing: string;
  previousOwners: number;
  accidentFree: boolean;
  nonsmoker: boolean;
  inspectionDate: string;
  registrationDate: string;
  tuv: string;
  location: string;
  contactPerson: string;
  notes: string;
}
type FormState = Omit<CarData, "id">;

// ----------------------
// Equipment options
// ----------------------
const equipmentOptions = {
  comfort: ["Klimaanlage", "Klimaautomatik", "Sitzheizung vorn"],
  safety: ["ABS", "ESP", "Airbag Fahrer"],
  multimedia: ["Radio", "Bluetooth", "USB-Anschluss"],
  exterior: ["Alufelgen", "Schiebedach", "LED-Scheinwerfer"],
  engineTransmission: ["Automatikgetriebe", "Schaltgetriebe"],
};

// ----------------------
// Admin Login
// ----------------------
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin = () => {
    if (password === "admin123") {
      onLogin();
      setError("");
    } else {
      setError("Falsches Passwort");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Shield className="h-10 w-10 text-blue-600 mx-auto mb-2" />
          <CardTitle className="text-2xl">Admin-Bereich</CardTitle>
          <CardDescription>Bitte Passwort eingeben</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="pwd">Passwort</Label>
          <input
            id="pwd"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-600">{error}</p>}
          <Button onClick={handleLogin} className="w-full">
            <Lock className="mr-2" /> Anmelden
          </Button>
          <Link
            href="/"
            className="block text-center text-sm text-gray-600 hover:text-blue-600"
          >
            ← Zurück
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

// ----------------------
// Equipment Selector
// ----------------------
function EquipmentSelector({
  category,
  title,
  options,
  selected = [],
  onChange,
}: {
  category: keyof CarData["equipment"];
  title: string;
  options: string[];
  selected?: string[];
  onChange: (cat: keyof CarData["equipment"], items: string[]) => void;
}) {
  const toggle = (opt: string) => {
    const next = selected.includes(opt)
      ? selected.filter((i) => i !== opt)
      : [...selected, opt];
    onChange(category, next);
  };
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-gray-900">
        {title} ({selected.length})
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ----------------------
// Initial form
// ----------------------
const initialForm: FormState = {
  brand: "",
  model: "",
  title: "",
  price: 0,
  year: new Date().getFullYear(),
  mileage: 0,
  fuel: "",
  transmission: "",
  power: "",
  displacement: "",
  color: "",
  doors: 4,
  seats: 5,
  images: [],
  equipment: {
    comfort: [],
    safety: [],
    multimedia: [],
    exterior: [],
    engineTransmission: [],
  },
  description: "",
  condition: "",
  warranty: "",
  financing: "",
  previousOwners: 0,
  accidentFree: true,
  nonsmoker: true,
  inspectionDate: "",
  registrationDate: "",
  tuv: "",
  location: "",
  contactPerson: "",
  notes: "",
};

// ----------------------
// AdminPage
// ----------------------
export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [cars, setCars] = useState<CarData[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [editCar, setEditCar] = useState<CarData | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  // load cars (Supabase oder localStorage)
  useEffect(() => {
    (async () => {
      if (isSupabaseConfigured() && supabase) {
        // Verwende Supabase
        const { data, error } = await supabase.from("cars").select("*");
        if (error) {
          console.error("Supabase Fehler:", error.message);
          loadFromLocalStorage(); // Fallback zu localStorage
        } else {
          setCars(data as CarData[]);
        }
      } else {
        // Fallback zu localStorage
        loadFromLocalStorage();
      }
    })();
  }, []);

  // localStorage Fallback
  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem("cars-data");
      if (stored) {
        setCars(JSON.parse(stored));
      }
    } catch (error) {
      console.error("localStorage Fehler:", error);
    }
  };

  const saveToLocalStorage = (carsData: CarData[]) => {
    try {
      localStorage.setItem("cars-data", JSON.stringify(carsData));
    } catch (error) {
      console.error("localStorage Speicher-Fehler:", error);
    }
  };

  const resetForm = () => setForm(initialForm);

  // create
  const saveNew = async () => {
    try {
      const payload = form as Omit<CarData, "id">;

      if (isSupabaseConfigured() && supabase) {
        // Verwende Supabase
        const { data, error } = await supabase
          .from("cars")
          .insert([payload])
          .select("*");

        if (error) {
          console.error("Supabase Fehler:", error.message);
          // Fallback zu localStorage
          saveNewToLocalStorage();
          return;
        }

        const inserted = (data as CarData[])[0];

        // Verschiebe temp Bilder in Auto-Ordner
        if (form.images.length > 0) {
          const movedImages = await moveImagesToCarFolder(
            form.images,
            inserted.id
          );

          // Aktualisiere Auto mit neuen Bild-URLs
          if (supabase) {
            await supabase
              .from("cars")
              .update({ images: movedImages })
              .eq("id", inserted.id);
          }

          inserted.images = movedImages;
        }

        setCars((prev) => [...prev, inserted]);
      } else {
        // localStorage Fallback
        saveNewToLocalStorage();
      }

      resetForm();
      setOpenAdd(false);
    } catch (error) {
      console.error("Error saving car:", error);
      // Letzte Chance: localStorage
      saveNewToLocalStorage();
    }
  };

  const saveNewToLocalStorage = () => {
    const newCar: CarData = {
      ...form,
      id: Math.random().toString(36).substr(2, 9), // Einfache ID-Generierung
    };
    const updatedCars = [...cars, newCar];
    setCars(updatedCars);
    saveToLocalStorage(updatedCars);
  };

  // update
  const saveEdit = async () => {
    if (!editCar) return;
    const payload = form as Omit<CarData, "id">;

    if (isSupabaseConfigured() && supabase) {
      // Verwende Supabase
      const { data, error } = await supabase
        .from("cars")
        .update(payload)
        .eq("id", editCar.id)
        .select("*");

      if (error) {
        console.error("Supabase Fehler:", error.message);
        // Fallback zu localStorage
        saveEditToLocalStorage();
      } else {
        const updated = (data as CarData[])[0];
        setCars((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      }
    } else {
      // localStorage Fallback
      saveEditToLocalStorage();
    }

    setEditCar(null);
    resetForm();
  };

  const saveEditToLocalStorage = () => {
    if (!editCar) return;
    const updated: CarData = { ...form, id: editCar.id };
    const updatedCars = cars.map((c) => (c.id === editCar.id ? updated : c));
    setCars(updatedCars);
    saveToLocalStorage(updatedCars);
  };

  // Delete
  const deleteCar = async (id: string) => {
    if (!supabase) {
      console.warn("Supabase ist nicht konfiguriert. Lösche nur lokal.");
      setCars((prev) => prev.filter((c) => c.id !== id));
      return;
    }

    const { error } = await supabase.from("cars").delete().eq("id", id);
    if (error) console.error(error.message);
    else setCars((prev) => prev.filter((c) => c.id !== id));
  };

  if (!isAuth) return <AdminLogin onLogin={() => setIsAuth(true)} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Nav */}
      <nav className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Car className="text-blue-600" />
            <span className="font-bold text-xl">Auto Service 19 - Admin</span>
          </div>
          <div className="flex gap-2">
            <Link href="/cars">
              <Button variant="ghost" size="sm">
                <Eye className="mr-1" /> Übersicht
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAuth(false)}
            >
              <Lock className="mr-1" /> Abmelden
            </Button>
          </div>
        </div>
      </nav>

      {/* Header + Add */}
      <div className="max-w-7xl mx-auto p-4">
        <header className="flex justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Fahrzeug-Verwaltung</h1>
            <p className="text-gray-600">Übersicht</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setOpenAdd(true);
            }}
          >
            <Plus className="mr-1" /> Neues Fahrzeug
          </Button>
        </header>

        {/* Add Dialog */}
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <></>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Neues Fahrzeug</DialogTitle>
              <DialogDescription>Füllen Sie alle Felder aus.</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="basic">Grunddaten</TabsTrigger>
                <TabsTrigger value="equipment">Ausstattung</TabsTrigger>
                <TabsTrigger value="images">Bilder</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              {/* --- BASIC --- */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marke *</Label>
                    <input
                      id="brand"
                      value={form.brand}
                      onChange={(e) =>
                        setForm({ ...form, brand: e.target.value })
                      }
                      placeholder="z.B. BMW"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Modell *</Label>
                    <input
                      id="model"
                      value={form.model}
                      onChange={(e) =>
                        setForm({ ...form, model: e.target.value })
                      }
                      placeholder="z.B. 3er"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Titel *</Label>
                    <input
                      id="title"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="z.B. BMW 3er 320d Touring"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Preis (€)*</Label>
                    <input
                      id="price"
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: Number(e.target.value) })
                      }
                      placeholder="18900"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Baujahr</Label>
                    <input
                      id="year"
                      type="number"
                      value={form.year}
                      onChange={(e) =>
                        setForm({ ...form, year: Number(e.target.value) })
                      }
                      placeholder="2018"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Kilometerstand</Label>
                    <input
                      id="mileage"
                      type="number"
                      value={form.mileage}
                      onChange={(e) =>
                        setForm({ ...form, mileage: Number(e.target.value) })
                      }
                      placeholder="85000"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuel">Kraftstoff</Label>
                    <Select
                      value={form.fuel}
                      onValueChange={(value) =>
                        setForm({ ...form, fuel: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Benzin">Benzin</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Elektro">Elektro</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Getriebe</Label>
                    <Select
                      value={form.transmission}
                      onValueChange={(value) =>
                        setForm({ ...form, transmission: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manuell">Manuell</SelectItem>
                        <SelectItem value="Automatik">Automatik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="power">Leistung</Label>
                    <input
                      id="power"
                      value={form.power}
                      onChange={(e) =>
                        setForm({ ...form, power: e.target.value })
                      }
                      placeholder="190 PS"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displacement">Hubraum</Label>
                    <input
                      id="displacement"
                      value={form.displacement}
                      onChange={(e) =>
                        setForm({ ...form, displacement: e.target.value })
                      }
                      placeholder="2.0L"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Farbe</Label>
                    <input
                      id="color"
                      value={form.color}
                      onChange={(e) =>
                        setForm({ ...form, color: e.target.value })
                      }
                      placeholder="Schwarz Metallic"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doors">Türen</Label>
                    <Select
                      value={String(form.doors)}
                      onValueChange={(v) =>
                        setForm({ ...form, doors: Number(v) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Zählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 5].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seats">Sitzplätze</Label>
                    <Select
                      value={String(form.seats)}
                      onValueChange={(v) =>
                        setForm({ ...form, seats: Number(v) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 4, 5, 7].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* --- EQUIPMENT --- */}
              <TabsContent value="equipment" className="space-y-4">
                <EquipmentSelector
                  category="comfort"
                  title="Komfort"
                  options={equipmentOptions.comfort}
                  selected={form.equipment.comfort}
                  onChange={(cat, items) =>
                    setForm({
                      ...form,
                      equipment: { ...form.equipment, [cat]: items },
                    })
                  }
                />
                <EquipmentSelector
                  category="safety"
                  title="Sicherheit"
                  options={equipmentOptions.safety}
                  selected={form.equipment.safety}
                  onChange={(cat, items) =>
                    setForm({
                      ...form,
                      equipment: { ...form.equipment, [cat]: items },
                    })
                  }
                />
                <EquipmentSelector
                  category="multimedia"
                  title="Multimedia"
                  options={equipmentOptions.multimedia}
                  selected={form.equipment.multimedia}
                  onChange={(cat, items) =>
                    setForm({
                      ...form,
                      equipment: { ...form.equipment, [cat]: items },
                    })
                  }
                />
                <EquipmentSelector
                  category="exterior"
                  title="Exterieur"
                  options={equipmentOptions.exterior}
                  selected={form.equipment.exterior}
                  onChange={(cat, items) =>
                    setForm({
                      ...form,
                      equipment: { ...form.equipment, [cat]: items },
                    })
                  }
                />
                <EquipmentSelector
                  category="engineTransmission"
                  title="Motor & Getriebe"
                  options={equipmentOptions.engineTransmission}
                  selected={form.equipment.engineTransmission}
                  onChange={(cat, items) =>
                    setForm({
                      ...form,
                      equipment: { ...form.equipment, [cat]: items },
                    })
                  }
                />
              </TabsContent>

              {/* --- IMAGES --- */}
              <TabsContent value="images" className="space-y-4">
                {/* native file upload */}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    if (!supabase) return;
                    const files = Array.from(e.target.files || []);
                    const urls: string[] = [];
                    for (const file of files) {
                      const filename = `${Date.now()}-${file.name}`;
                      const { error } = await supabase.storage
                        .from("images")
                        .upload(filename, file);
                      if (!error)
                        urls.push(
                          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${filename}`
                        );
                    }
                    setForm({ ...form, images: [...form.images, ...urls] });
                  }}
                />
              </TabsContent>

              {/* --- DETAILS --- */}
              <TabsContent value="details" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="condition">Zustand</Label>
                  <Select
                    value={form.condition}
                    onValueChange={(v) => setForm({ ...form, condition: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Neuwertig", "Sehr gut", "Gut", "Gebraucht"].map(
                        (s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previousOwners">Vorbesitzer</Label>
                  <input
                    id="previousOwners"
                    type="number"
                    value={form.previousOwners}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        previousOwners: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inspectionDate">Letzte Inspektion</Label>
                  <input
                    id="inspectionDate"
                    type="date"
                    value={form.inspectionDate}
                    onChange={(e) =>
                      setForm({ ...form, inspectionDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationDate">Erstzulassung</Label>
                  <input
                    id="registrationDate"
                    type="date"
                    value={form.registrationDate}
                    onChange={(e) =>
                      setForm({ ...form, registrationDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tuv">TÜV</Label>
                  <input
                    id="tuv"
                    value={form.tuv}
                    onChange={(e) => setForm({ ...form, tuv: e.target.value })}
                    placeholder="TÜV bis MM/JJJJ"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Standort</Label>
                  <input
                    id="location"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="Stadt"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Ansprechpartner</Label>
                  <input
                    id="contactPerson"
                    value={form.contactPerson}
                    onChange={(e) =>
                      setForm({ ...form, contactPerson: e.target.value })
                    }
                    placeholder="Name"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warranty">Garantie</Label>
                  <input
                    id="warranty"
                    value={form.warranty}
                    onChange={(e) =>
                      setForm({ ...form, warranty: e.target.value })
                    }
                    placeholder="z.B. 12 Monate"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="financing">Finanzierung</Label>
                  <input
                    id="financing"
                    value={form.financing}
                    onChange={(e) =>
                      setForm({ ...form, financing: e.target.value })
                    }
                    placeholder="ab X€/Monat"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Beschreibung</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Interne Notizen</Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                  />
                </div>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={form.accidentFree}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          accidentFree: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span>Unfallfrei</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={form.nonsmoker}
                      onChange={(e) =>
                        setForm({ ...form, nonsmoker: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span>Nichtraucher</span>
                  </label>
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setOpenAdd(false)}>
                Abbrechen
              </Button>
              <Button onClick={saveNew}>
                <Save className="mr-1" /> Speichern
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={!!editCar}
          onOpenChange={() => {
            setEditCar(null);
            resetForm();
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Fahrzeug bearbeiten: {editCar?.title}</DialogTitle>
              <DialogDescription>
                Bearbeiten Sie die Fahrzeugdaten.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="basic">Grunddaten</TabsTrigger>
                <TabsTrigger value="equipment">Ausstattung</TabsTrigger>
                <TabsTrigger value="images">Bilder</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              {/* --- BASIC --- */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-brand">Marke *</Label>
                    <input
                      id="edit-brand"
                      value={form.brand}
                      onChange={(e) =>
                        setForm({ ...form, brand: e.target.value })
                      }
                      placeholder="z.B. BMW"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-model">Modell *</Label>
                    <input
                      id="edit-model"
                      value={form.model}
                      onChange={(e) =>
                        setForm({ ...form, model: e.target.value })
                      }
                      placeholder="z.B. 3er"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="edit-title">Titel *</Label>
                    <input
                      id="edit-title"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="z.B. BMW 3er 320d Touring"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Preis (€)*</Label>
                    <input
                      id="edit-price"
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: Number(e.target.value) })
                      }
                      placeholder="18900"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-year">Baujahr</Label>
                    <input
                      id="edit-year"
                      type="number"
                      value={form.year}
                      onChange={(e) =>
                        setForm({ ...form, year: Number(e.target.value) })
                      }
                      placeholder="2018"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-mileage">Kilometerstand</Label>
                    <input
                      id="edit-mileage"
                      type="number"
                      value={form.mileage}
                      onChange={(e) =>
                        setForm({ ...form, mileage: Number(e.target.value) })
                      }
                      placeholder="85000"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-fuel">Kraftstoff</Label>
                    <Select
                      value={form.fuel}
                      onValueChange={(value) =>
                        setForm({ ...form, fuel: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Benzin">Benzin</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Elektro">Elektro</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-transmission">Getriebe</Label>
                    <Select
                      value={form.transmission}
                      onValueChange={(value) =>
                        setForm({ ...form, transmission: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manuell">Manuell</SelectItem>
                        <SelectItem value="Automatik">Automatik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-power">Leistung</Label>
                    <input
                      id="edit-power"
                      value={form.power}
                      onChange={(e) =>
                        setForm({ ...form, power: e.target.value })
                      }
                      placeholder="190 PS"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-displacement">Hubraum</Label>
                    <input
                      id="edit-displacement"
                      value={form.displacement}
                      onChange={(e) =>
                        setForm({ ...form, displacement: e.target.value })
                      }
                      placeholder="2.0L"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-color">Farbe</Label>
                    <input
                      id="edit-color"
                      value={form.color}
                      onChange={(e) =>
                        setForm({ ...form, color: e.target.value })
                      }
                      placeholder="Schwarz Metallic"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-doors">Türen</Label>
                    <Select
                      value={String(form.doors)}
                      onValueChange={(v) =>
                        setForm({ ...form, doors: Number(v) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Zählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 5].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-seats">Sitzplätze</Label>
                    <Select
                      value={String(form.seats)}
                      onValueChange={(v) =>
                        setForm({ ...form, seats: Number(v) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 4, 5, 7].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* --- EQUIPMENT --- */}
              <TabsContent value="equipment" className="space-y-4">
                <EquipmentSelector
                  category="comfort"
                  title="Komfort"
                  options={equipmentOptions.comfort}
                  selected={form.equipment.comfort}
                  onChange={(cat, items) =>
                    setForm({
                      ...form,
                      equipment: { ...form.equipment, [cat]: items },
                    })
                  }
                />
                <EquipmentSelector
                  category="safety"
                  title="Sicherheit"
                  options={equipmentOptions.safety}
                  selected={form.equipment.safety}
                  onChange={(cat, items) =>
                    setForm({
                      ...form,
                      equipment: { ...form.equipment, [cat]: items },
                    })
                  }
                />
                <EquipmentSelector
                  category="multimedia"
                  title="Multimedia"
                  options={equipmentOptions.multimedia}
                  selected={form.equipment.multimedia}
                  onChange={(cat, items) =>
                    setForm({
                      ...form,
                      equipment: { ...form.equipment, [cat]: items },
                    })
                  }
                />
                <EquipmentSelector
                  category="exterior"
                  title="Exterieur"
                  options={equipmentOptions.exterior}
                  selected={form.equipment.exterior}
                  onChange={(cat, items) =>
                    setForm({
                      ...form,
                      equipment: { ...form.equipment, [cat]: items },
                    })
                  }
                />
                <EquipmentSelector
                  category="engineTransmission"
                  title="Motor & Getriebe"
                  options={equipmentOptions.engineTransmission}
                  selected={form.equipment.engineTransmission}
                  onChange={(cat, items) =>
                    setForm({
                      ...form,
                      equipment: { ...form.equipment, [cat]: items },
                    })
                  }
                />
              </TabsContent>

              {/* --- IMAGES --- */}
              <TabsContent value="images" className="space-y-4">
                <ImageUpload
                  images={form.images}
                  onImagesChange={(imgs) => setForm({ ...form, images: imgs })}
                  carId={editCar?.id} // Verwende existierende Auto-ID
                  maxImages={15}
                />
              </TabsContent>

              {/* --- DETAILS --- */}
              <TabsContent value="details" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-condition">Zustand</Label>
                  <Select
                    value={form.condition}
                    onValueChange={(v) => setForm({ ...form, condition: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Neuwertig", "Sehr gut", "Gut", "Gebraucht"].map(
                        (s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-previousOwners">Vorbesitzer</Label>
                  <input
                    id="edit-previousOwners"
                    type="number"
                    value={form.previousOwners}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        previousOwners: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-inspectionDate">Letzte Inspektion</Label>
                  <input
                    id="edit-inspectionDate"
                    type="date"
                    value={form.inspectionDate}
                    onChange={(e) =>
                      setForm({ ...form, inspectionDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-registrationDate">Erstzulassung</Label>
                  <input
                    id="edit-registrationDate"
                    type="date"
                    value={form.registrationDate}
                    onChange={(e) =>
                      setForm({ ...form, registrationDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tuv">TÜV</Label>
                  <input
                    id="edit-tuv"
                    value={form.tuv}
                    onChange={(e) => setForm({ ...form, tuv: e.target.value })}
                    placeholder="TÜV bis MM/JJJJ"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Standort</Label>
                  <input
                    id="edit-location"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="Stadt"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contactPerson">Ansprechpartner</Label>
                  <input
                    id="edit-contactPerson"
                    value={form.contactPerson}
                    onChange={(e) =>
                      setForm({ ...form, contactPerson: e.target.value })
                    }
                    placeholder="Name"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-warranty">Garantie</Label>
                  <input
                    id="edit-warranty"
                    value={form.warranty}
                    onChange={(e) =>
                      setForm({ ...form, warranty: e.target.value })
                    }
                    placeholder="z.B. 12 Monate"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-financing">Finanzierung</Label>
                  <input
                    id="edit-financing"
                    value={form.financing}
                    onChange={(e) =>
                      setForm({ ...form, financing: e.target.value })
                    }
                    placeholder="ab X€/Monat"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Beschreibung</Label>
                  <Textarea
                    id="edit-description"
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-notes">Interne Notizen</Label>
                  <Textarea
                    id="edit-notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                  />
                </div>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={form.accidentFree}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          accidentFree: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span>Unfallfrei</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={form.nonsmoker}
                      onChange={(e) =>
                        setForm({ ...form, nonsmoker: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span>Nichtraucher</span>
                  </label>
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setEditCar(null)}>
                Abbrechen
              </Button>
              <Button onClick={saveEdit}>
                <Save className="mr-1" /> Aktualisieren
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* List */}
        <div className="space-y-6">
          {cars.map((car) => (
            <Card key={car.id}>
              <CardContent className="flex gap-6 p-6">
                <div className="w-48">
                  <img
                    src={car.images[0] || ""}
                    alt={car.title}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{car.title}</h3>
                  <p className="mt-2 text-2xl font-bold text-blue-600">
                    {car.price.toLocaleString("de-DE")} €
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditCar(car);
                        // Kopiere car data ohne id für form
                        const { id, ...carData } = car;
                        setForm(carData);
                      }}
                    >
                      <Edit />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteCar(car.id)}
                    >
                      <Trash2 className="text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
