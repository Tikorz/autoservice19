"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Shield,
  Lock,
  ImageIcon,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// === Typen ===
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
type FormState = Partial<CarData>;

// === Optionslisten ===
const equipmentOptions = {
  comfort: ["Klimaanlage", "Klimaautomatik", "Sitzheizung vorn" /*…*/],
  safety: ["ABS", "ESP", "Airbag Fahrer" /*…*/],
  multimedia: ["Radio", "Bluetooth", "USB-Anschluss" /*…*/],
  exterior: ["Alufelgen", "Schiebedach", "LED-Scheinwerfer" /*…*/],
  engineTransmission: ["Automatikgetriebe", "Schaltgetriebe" /*…*/],
};

// === Login-Dialog ===
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === "admin123") {
      onLogin();
      setError("");
    } else setError("Falsches Passwort");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
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

// === Equipment-Selector ===
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
  onChange: (cat: keyof CarData["equipment"], list: string[]) => void;
}) {
  const toggle = (opt: string) => {
    const next = selected.includes(opt)
      ? selected.filter((i) => i !== opt)
      : [...selected, opt];
    onChange(category, next);
  };
  return (
    <div className="space-y-1">
      <h5 className="font-medium">
        {title} ({selected.length})
      </h5>
      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto">
        {options.map((opt) => (
          <label key={opt} className="flex items-center">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              className="mr-2"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// === ImageGallery ===
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
          placeholder="Bild-URL"
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
                className="w-full h-24 object-cover rounded"
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

// === Initial-Zustand ===
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

// === Hauptkomponente ===
export default function AdminPage() {
  const supabase = createClientComponentClient();
  const [isAuth, setIsAuth] = useState(false);
  const [cars, setCars] = useState<CarData[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [editCar, setEditCar] = useState<CarData | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  // Load
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("cars").select("*");
      if (error) console.error(error);
      else setCars(data as CarData[]);
    })();
  }, [supabase]);

  const resetForm = () => setForm(initialForm);

  // Create
  const saveNew = async () => {
    const payload = form as Omit<CarData, "id">;
    const { data, error } = await supabase
      .from("cars")
      .insert([payload])
      .select("*");
    if (error) console.error(error);
    else setCars((p) => [...p, data![0] as CarData]);
    resetForm();
    setOpenAdd(false);
  };

  // Update
  const saveEdit = async () => {
    if (!editCar) return;
    const payload = form as Omit<CarData, "id">;
    const { data, error } = await supabase
      .from("cars")
      .update(payload)
      .eq("id", editCar.id)
      .select("*");
    if (error) console.error(error);
    else {
      const updated = data![0] as CarData;
      setCars((p) => p.map((c) => (c.id === updated.id ? updated : c)));
    }
    setEditCar(null);
    resetForm();
  };

  // Delete
  const deleteCar = async (id: number) => {
    const { error } = await supabase.from("cars").delete().eq("id", id);
    if (error) console.error(error);
    else setCars((p) => p.filter((c) => c.id !== id));
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

      {/* Content */}
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

        {/* Add-Dialog */}
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Neues Fahrzeug</DialogTitle>
              <DialogDescription>Füllen Sie die Daten aus.</DialogDescription>
            </DialogHeader>
            {/* … hier dieselben Tabs/Form-Felder wie im vorherigen Beispiel … */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setOpenAdd(false)}>
                Abbrechen
              </Button>
              <Button onClick={saveNew}>
                <Save className="mr-1" />
                Speichern
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit-Dialog */}
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
            {/* … Tabs/Form wie oben … */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setEditCar(null)}>
                Abbrechen
              </Button>
              <Button onClick={saveEdit}>
                <Save className="mr-1" />
                Aktualisieren
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Liste */}
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
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditCar(car);
                        setForm(car);
                      }}
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
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
