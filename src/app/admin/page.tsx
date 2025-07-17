"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
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
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Car as CarIcon,
  Plus,
  Edit,
  Trash2,
  Save,
  Shield,
  Lock,
  ImageIcon,
  Eye,
  X,
} from "lucide-react";
import Link from "next/link";

// -------------------------------
// Typen
// -------------------------------
export interface CarData {
  id: number;
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

// -------------------------------
// Initial‑Formstate
// -------------------------------
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

// -------------------------------
// Equipment‑Optionen (Mock)
// -------------------------------
const equipmentOptions = {
  comfort: [
    "Klimaanlage",
    "Klimaautomatik",
    "Sitzheizung vorn",
    "Sitzheizung hinten",
    "Lenkradheizung",
    "Tempomat",
  ],
  safety: ["ABS", "ESP", "Airbag Fahrer", "Airbag Beifahrer"],
  multimedia: ["Radio", "Bluetooth", "USB-Anschluss", "Navigationssystem"],
  exterior: ["Alufelgen", "Schiebedach", "LED-Scheinwerfer"],
  engineTransmission: ["Automatikgetriebe", "Schaltgetriebe", "Allradantrieb"],
};

// -------------------------------
// Admin‑Login
// -------------------------------
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const login = () => {
    if (pwd === "admin123") {
      onLogin();
      setErr("");
    } else {
      setErr("Falsches Passwort");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Shield className="h-10 w-10 text-blue-600 mx-auto mb-2" />
          <CardTitle className="text-2xl">Admin‑Bereich</CardTitle>
          <CardDescription>Passwort eingeben</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="pwd">Passwort</Label>
          <input
            id="pwd"
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {err && <p className="text-red-600">{err}</p>}
          <Button onClick={login} className="w-full">
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

// -------------------------------
// Equipment‑Selector
// -------------------------------
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
      <Label className="font-semibold">
        {title} ({selected.length})
      </Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-auto">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
          >
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// -------------------------------
// Image‑Gallery
// -------------------------------
function ImageGallery({
  images = [],
  onImagesChange,
}: {
  images?: string[];
  onImagesChange: (imgs: string[]) => void;
}) {
  const [url, setUrl] = useState("");
  const add = () => {
    const u = url.trim();
    if (u && !images.includes(u)) onImagesChange([...images, u]);
    setUrl("");
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Bild‑URL hinzufügen…"
          className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
        <Button size="sm" onClick={add}>
          <Plus />
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.length ? (
          images.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img}
                alt={`Bild ${i + 1}`}
                className="w-full h-24 object-cover rounded border"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://via.placeholder.com/200x150?text=nicht+verfügbar")
                }
              />
              <button
                onClick={() =>
                  onImagesChange(images.filter((_, idx) => idx !== i))
                }
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center h-24 border-2 border-dashed rounded">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}

// ==================================================
// AdminPage
// ==================================================
export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [cars, setCars] = useState<CarData[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [editCar, setEditCar] = useState<CarData | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  // load from Supabase
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("cars").select("*");
      if (error) console.error(error.message);
      else setCars(data as CarData[]);
    })();
  }, []);

  const resetForm = () => setForm(initialForm);

  // create
  const saveNew = async () => {
    const payload = form as Omit<CarData, "id">;
    const { data, error } = await supabase
      .from("cars")
      .insert([payload])
      .select("*");
    if (error) console.error(error.message);
    else {
      const inserted = (data as CarData[])[0];
      setCars((prev) => [...prev, inserted]);
    }
    resetForm();
    setOpenAdd(false);
  };

  // update
  const saveEdit = async () => {
    if (!editCar) return;
    const payload = form as Omit<CarData, "id">;
    const { data, error } = await supabase
      .from("cars")
      .update(payload)
      .eq("id", editCar.id)
      .select("*");
    if (error) console.error(error.message);
    else {
      const updated = (data as CarData[])[0];
      setCars((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    }
    setEditCar(null);
    resetForm();
  };

  // delete
  const deleteCar = async (id: number) => {
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
            <CarIcon className="text-blue-600" />
            <span className="font-bold text-xl">Auto Service 19 - Admin</span>
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

      <div className="max-w-7xl mx-auto p-4">
        {/* Header + Add */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Fahrzeug‑Verwaltung</h1>
            <p className="text-gray-600">Übersicht</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setOpenAdd(true);
            }}
          >
            <Plus className="mr-1" />
            Neues Fahrzeug
          </Button>
        </header>

        {/* Add‑Dialog */}
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Neues Fahrzeug</DialogTitle>
              <DialogDescription>Fülle alle Felder aus</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="basic">Grunddaten</TabsTrigger>
                <TabsTrigger value="equipment">Ausstattung</TabsTrigger>
                <TabsTrigger value="images">Bilder</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              {/* Basic */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Marke */}
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
                  {/* Modell */}
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
                  {/* Titel */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Vollständiger Titel *</Label>
                    <input
                      id="title"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="z.B. BMW 3er 320d Touring"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Preis */}
                  <div className="space-y-2">
                    <Label htmlFor="price">Preis (€) *</Label>
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
                  {/* Baujahr */}
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
                  {/* Kilometerstand */}
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
                  {/* Kraftstoff */}
                  <div className="space-y-2">
                    <Label htmlFor="fuel">Kraftstoff</Label>
                    <Select
                      value={form.fuel}
                      onValueChange={(v) => setForm({ ...form, fuel: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen…" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Benzin">Benzin</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Elektro">Elektro</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Getriebe */}
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Getriebe</Label>
                    <Select
                      value={form.transmission}
                      onValueChange={(v) =>
                        setForm({ ...form, transmission: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen…" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manuell">Manuell</SelectItem>
                        <SelectItem value="Automatik">Automatik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Leistung */}
                  <div className="space-y-2">
                    <Label htmlFor="power">Leistung</Label>
                    <input
                      id="power"
                      value={form.power}
                      onChange={(e) =>
                        setForm({ ...form, power: e.target.value })
                      }
                      placeholder="190 PS"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Hubraum */}
                  <div className="space-y-2">
                    <Label htmlFor="displacement">Hubraum</Label>
                    <input
                      id="displacement"
                      value={form.displacement}
                      onChange={(e) =>
                        setForm({ ...form, displacement: e.target.value })
                      }
                      placeholder="2.0 L"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Farbe */}
                  <div className="space-y-2">
                    <Label htmlFor="color">Farbe</Label>
                    <input
                      id="color"
                      value={form.color}
                      onChange={(e) =>
                        setForm({ ...form, color: e.target.value })
                      }
                      placeholder="Schwarz Metallic"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Türen */}
                  <div className="space-y-2">
                    <Label htmlFor="doors">Türen</Label>
                    <Select
                      value={String(form.doors)}
                      onValueChange={(v) =>
                        setForm({ ...form, doors: Number(v) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Anzahl" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Sitze */}
                  <div className="space-y-2">
                    <Label htmlFor="seats">Sitzplätze</Label>
                    <Select
                      value={String(form.seats)}
                      onValueChange={(v) =>
                        setForm({ ...form, seats: Number(v) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Anzahl" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="7">7</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* Ausstattung */}
              <TabsContent value="equipment" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    title="Motor & Getriebe"
                    options={equipmentOptions.engineTransmission}
                    selected={form.equipment.engineTransmission}
                    onChange={(cat, items) =>
                      setForm({
                        ...form,
                        equipment: { ...form.equipment, [cat]: items },
                      })
                    }
                  />
                </div>
              </TabsContent>

              {/* Bilder */}
              <TabsContent value="images" className="space-y-4">
                <ImageGallery
                  images={form.images}
                  onImagesChange={(imgs) => setForm({ ...form, images: imgs })}
                />
              </TabsContent>

              {/* Details */}
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Zustand */}
                  <div className="space-y-2">
                    <Label htmlFor="condition">Zustand</Label>
                    <Select
                      value={form.condition}
                      onValueChange={(v) => setForm({ ...form, condition: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen…" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Neuwertig">Neuwertig</SelectItem>
                        <SelectItem value="Sehr gut">Sehr gut</SelectItem>
                        <SelectItem value="Gut">Gut</SelectItem>
                        <SelectItem value="Gebraucht">Gebraucht</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Vorbesitzer */}
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
                  {/* Letzte Inspektion */}
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
                  {/* Erstzulassung */}
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
                  {/* TÜV */}
                  <div className="space-y-2">
                    <Label htmlFor="tuv">TÜV</Label>
                    <input
                      id="tuv"
                      value={form.tuv}
                      onChange={(e) =>
                        setForm({ ...form, tuv: e.target.value })
                      }
                      placeholder="TÜV bis 08/2026"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Standort */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Standort</Label>
                    <input
                      id="location"
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                      placeholder="Berlin"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Ansprechpartner */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="contactPerson">Ansprechpartner</Label>
                    <input
                      id="contactPerson"
                      value={form.contactPerson}
                      onChange={(e) =>
                        setForm({ ...form, contactPerson: e.target.value })
                      }
                      placeholder="Max Mustermann"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Garantie */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="warranty">Garantie</Label>
                    <input
                      id="warranty"
                      value={form.warranty}
                      onChange={(e) =>
                        setForm({ ...form, warranty: e.target.value })
                      }
                      placeholder="12 Monate Garantie"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Finanzierung */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="financing">Finanzierung</Label>
                    <input
                      id="financing"
                      value={form.financing}
                      onChange={(e) =>
                        setForm({ ...form, financing: e.target.value })
                      }
                      placeholder="ab 199 €/Monat"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Beschreibung */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Beschreibung</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      rows={4}
                    />
                  </div>
                  {/* Interne Notizen */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Notizen</Label>
                    <Textarea
                      id="notes"
                      value={form.notes}
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                  {/* Checkboxes */}
                  <div className="flex items-center space-x-6 md:col-span-2">
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
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Nichtraucher</span>
                    </label>
                  </div>
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

        {/* Edit‑Dialog */}
        <Dialog
          open={!!editCar}
          onOpenChange={() => {
            setEditCar(null);
            resetForm();
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Fahrzeug bearbeiten</DialogTitle>
            </DialogHeader>
            {/* gleiche Tabs/Form wie oben, nur Buttons unten: */}
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

        {/* Fahrzeug‑Liste */}
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
                    {car.price.toLocaleString("de-DE")} €
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditCar(car);
                        setForm(car);
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
