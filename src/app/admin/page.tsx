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
  CheckCircle,
  Shield,
  Lock,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CarData {
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

const equipmentOptions = {
  /* same as before */
};

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Admin-Bereich</CardTitle>
          <CardDescription>
            Bitte geben Sie das Administrator-Passwort ein
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Passwort eingeben"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <Button onClick={handleLogin} className="w-full">
            <Lock className="h-4 w-4 mr-2" /> Anmelden
          </Button>
          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              ← Zurück zur Hauptseite
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  const supabase = createClientComponentClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cars, setCars] = useState<CarData[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarData | null>(null);
  const [formData, setFormData] = useState<any>({
    /* same initial fields */
  });

  useEffect(() => {
    // Load cars from Supabase
    async function loadCars() {
      const { data, error } = await supabase.from<CarData>("cars").select("*");
      if (error) console.error("Fehler beim Laden:", error.message);
      else setCars(data || []);
    }
    loadCars();
  }, []);

  const resetForm = () =>
    setFormData({
      /* reset fields as before */
    });

  const handleAddCar = async () => {
    if (!formData.title || !formData.price) return;
    const payload = { ...formData };
    const { data, error } = await supabase
      .from<CarData>("cars")
      .insert([payload])
      .select();
    if (error) console.error("Fehler beim Hinzufügen:", error.message);
    else if (data && data[0]) setCars((prev) => [...prev, data[0]]);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditCar = (car: CarData) => {
    setEditingCar(car);
    setFormData({
      /* populate from car */
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateCar = async () => {
    if (!editingCar) return;
    const payload = { ...formData };
    const { data, error } = await supabase
      .from<CarData>("cars")
      .update(payload)
      .eq("id", editingCar.id)
      .select();
    if (error) console.error("Fehler beim Aktualisieren:", error.message);
    else if (data && data[0])
      setCars((prev) =>
        prev.map((c) => (c.id === editingCar.id ? data[0] : c))
      );
    setEditingCar(null);
    resetForm();
  };

  const handleDeleteCar = async (id: number) => {
    const { error } = await supabase.from("cars").delete().eq("id", id);
    if (error) console.error("Fehler beim Löschen:", error.message);
    else setCars((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEquipmentChange = (category: string, equipment: string[]) => {
    setFormData({
      ...formData,
      equipment: { ...formData.equipment, [category]: equipment },
    });
  };

  if (!isAuthenticated)
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Admin-Bereich</CardTitle>
          <CardDescription>
            Bitte geben Sie das Administrator-Passwort ein
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Passwort eingeben"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <Button onClick={handleLogin} className="w-full">
            <Lock className="h-4 w-4 mr-2" />
            Anmelden
          </Button>
          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              ← Zurück zur Hauptseite
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Equipment Selector Component
function EquipmentSelector({
  category,
  title,
  options,
  selected,
  onChange,
}: {
  category: string;
  title: string;
  options: string[];
  selected: string[];
  onChange: (category: string, equipment: string[]) => void;
}) {
  const handleToggle = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onChange(category, newSelected);
  };

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-900">
        {title} ({selected.length})
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => handleToggle(option)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// Image Gallery Component
function ImageGallery({
  images,
  onImagesChange,
}: {
  images: string[];
  onImagesChange: (images: string[]) => void;
}) {
  const [newImageUrl, setNewImageUrl] = useState("");

  const addImage = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      onImagesChange([...images, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="url"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Bild-URL hinzufügen..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button onClick={addImage} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Fahrzeugbild ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg border"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/200x150?text=Bild+nicht+verfügbar";
              }}
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full flex items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Noch keine Bilder</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cars, setCars] = useState<CarData[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarData | null>(null);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    title: "",
    price: "",
    year: "",
    mileage: "",
    fuel: "",
    transmission: "",
    power: "",
    displacement: "",
    color: "",
    doors: "",
    seats: "",
    images: [] as string[],
    equipment: {
      comfort: [] as string[],
      safety: [] as string[],
      multimedia: [] as string[],
      exterior: [] as string[],
      engineTransmission: [] as string[],
    },
    description: "",
    condition: "",
    warranty: "",
    financing: "",
    previousOwners: "",
    accidentFree: true,
    nonsmoker: true,
    inspectionDate: "",
    registrationDate: "",
    tuv: "",
    location: "",
    contactPerson: "",
    notes: "",
  });

  // Load cars from localStorage
  useEffect(() => {
    const savedCars = localStorage.getItem("adminCars");
    if (savedCars) {
      setCars(JSON.parse(savedCars));
    } else {
      // Default car data
      const defaultCars: CarData[] = [
        {
          id: 1,
          brand: "BMW",
          model: "3er",
          title: "BMW 3er 320d Touring",
          price: 18900,
          year: 2018,
          mileage: 85000,
          fuel: "Diesel",
          transmission: "Automatik",
          power: "190 PS",
          displacement: "2.0L",
          color: "Schwarz Metallic",
          doors: 5,
          seats: 5,
          images: [
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop",
          ],
          equipment: {
            comfort: ["Klimaautomatik", "Sitzheizung vorn", "Tempomat"],
            safety: ["ABS", "ESP", "Airbag Fahrer", "Airbag Beifahrer"],
            multimedia: ["Navigationssystem", "Bluetooth", "USB-Anschluss"],
            exterior: [
              "Xenon-Scheinwerfer",
              "Alufelgen",
              "Metallic-Lackierung",
            ],
            engineTransmission: [
              "Automatikgetriebe",
              "Start-Stopp-System",
              "EURO 6",
            ],
          },
          description:
            "Gepflegter BMW 3er Touring mit umfangreicher Ausstattung.",
          condition: "Sehr gut",
          warranty: "12 Monate Garantie",
          financing: "Finanzierung möglich ab 199€/Monat",
          previousOwners: 2,
          accidentFree: true,
          nonsmoker: true,
          inspectionDate: "2024-08-15",
          registrationDate: "2018-03-20",
          tuv: "TÜV bis 08/2026",
          location: "Berlin",
          contactPerson: "Max Mustermann",
          notes: "Serviceheft vollständig vorhanden",
        },
      ];
      setCars(defaultCars);
      localStorage.setItem("adminCars", JSON.stringify(defaultCars));
    }
  }, []);

  // Save cars to localStorage
  const saveCars = (newCars: CarData[]) => {
    setCars(newCars);
    localStorage.setItem("adminCars", JSON.stringify(newCars));
  };

  const resetForm = () => {
    setFormData({
      brand: "",
      model: "",
      title: "",
      price: "",
      year: "",
      mileage: "",
      fuel: "",
      transmission: "",
      power: "",
      displacement: "",
      color: "",
      doors: "",
      seats: "",
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
      previousOwners: "",
      accidentFree: true,
      nonsmoker: true,
      inspectionDate: "",
      registrationDate: "",
      tuv: "",
      location: "",
      contactPerson: "",
      notes: "",
    });
  };

  const handleAddCar = () => {
    if (!formData.title || !formData.price) return;

    const newCar: CarData = {
      id: Math.max(...cars.map((c) => c.id), 0) + 1,
      brand: formData.brand,
      model: formData.model,
      title: formData.title,
      price: parseInt(formData.price),
      year: parseInt(formData.year) || 2020,
      mileage: parseInt(formData.mileage) || 0,
      fuel: formData.fuel || "Benzin",
      transmission: formData.transmission || "Manuell",
      power: formData.power || "150 PS",
      displacement: formData.displacement || "2.0L",
      color: formData.color || "Schwarz",
      doors: parseInt(formData.doors) || 5,
      seats: parseInt(formData.seats) || 5,
      images: formData.images,
      equipment: formData.equipment,
      description: formData.description,
      condition: formData.condition || "Gut",
      warranty: formData.warranty || "12 Monate Garantie",
      financing: formData.financing || "Finanzierung verfügbar",
      previousOwners: parseInt(formData.previousOwners) || 1,
      accidentFree: formData.accidentFree,
      nonsmoker: formData.nonsmoker,
      inspectionDate: formData.inspectionDate,
      registrationDate: formData.registrationDate,
      tuv: formData.tuv,
      location: formData.location,
      contactPerson: formData.contactPerson,
      notes: formData.notes,
    };

    saveCars([...cars, newCar]);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditCar = (car: CarData) => {
    setEditingCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      title: car.title,
      price: car.price.toString(),
      year: car.year.toString(),
      mileage: car.mileage.toString(),
      fuel: car.fuel,
      transmission: car.transmission,
      power: car.power,
      displacement: car.displacement,
      color: car.color,
      doors: car.doors.toString(),
      seats: car.seats.toString(),
      images: car.images,
      equipment: car.equipment,
      description: car.description,
      condition: car.condition,
      warranty: car.warranty,
      financing: car.financing,
      previousOwners: car.previousOwners.toString(),
      accidentFree: car.accidentFree,
      nonsmoker: car.nonsmoker,
      inspectionDate: car.inspectionDate,
      registrationDate: car.registrationDate,
      tuv: car.tuv,
      location: car.location,
      contactPerson: car.contactPerson,
      notes: car.notes,
    });
  };

  const handleUpdateCar = () => {
    if (!editingCar || !formData.title || !formData.price) return;

    const updatedCar: CarData = {
      ...editingCar,
      brand: formData.brand,
      model: formData.model,
      title: formData.title,
      price: parseInt(formData.price),
      year: parseInt(formData.year),
      mileage: parseInt(formData.mileage),
      fuel: formData.fuel,
      transmission: formData.transmission,
      power: formData.power,
      displacement: formData.displacement,
      color: formData.color,
      doors: parseInt(formData.doors),
      seats: parseInt(formData.seats),
      images: formData.images,
      equipment: formData.equipment,
      description: formData.description,
      condition: formData.condition,
      warranty: formData.warranty,
      financing: formData.financing,
      previousOwners: parseInt(formData.previousOwners),
      accidentFree: formData.accidentFree,
      nonsmoker: formData.nonsmoker,
      inspectionDate: formData.inspectionDate,
      registrationDate: formData.registrationDate,
      tuv: formData.tuv,
      location: formData.location,
      contactPerson: formData.contactPerson,
      notes: formData.notes,
    };

    saveCars(cars.map((car) => (car.id === editingCar.id ? updatedCar : car)));
    setEditingCar(null);
    resetForm();
  };

  const handleDeleteCar = (id: number) => {
    saveCars(cars.filter((car) => car.id !== id));
  };

  const handleEquipmentChange = (category: string, equipment: string[]) => {
    setFormData({
      ...formData,
      equipment: {
        ...formData.equipment,
        [category]: equipment,
      },
    });
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                Auto Service 19 - Admin
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/cars">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Autohandel ansehen
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zur Hauptseite
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAuthenticated(false)}
              >
                <Lock className="h-4 w-4 mr-2" />
                Abmelden
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Fahrzeug-Verwaltung
            </h1>
            <p className="text-gray-600 mt-2">
              Verwalten Sie die verfügbaren Fahrzeuge mit umfangreicher
              Ausstattung
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Neues Fahrzeug
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Neues Fahrzeug hinzufügen</DialogTitle>
                <DialogDescription>
                  Geben Sie alle Details des neuen Fahrzeugs ein.
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Grunddaten</TabsTrigger>
                  <TabsTrigger value="equipment">Ausstattung</TabsTrigger>
                  <TabsTrigger value="images">Bilder</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Marke *</Label>
                      <input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                        placeholder="z.B. BMW"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model">Modell *</Label>
                      <input
                        id="model"
                        value={formData.model}
                        onChange={(e) =>
                          setFormData({ ...formData, model: e.target.value })
                        }
                        placeholder="z.B. 3er"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="title">Vollständiger Titel *</Label>
                      <input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="z.B. BMW 3er 320d Touring"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Preis (€) *</Label>
                      <input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        placeholder="18900"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Baujahr</Label>
                      <input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) =>
                          setFormData({ ...formData, year: e.target.value })
                        }
                        placeholder="2018"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mileage">Kilometerstand</Label>
                      <input
                        id="mileage"
                        type="number"
                        value={formData.mileage}
                        onChange={(e) =>
                          setFormData({ ...formData, mileage: e.target.value })
                        }
                        placeholder="85000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fuel">Kraftstoff</Label>
                      <Select
                        value={formData.fuel}
                        onValueChange={(value) =>
                          setFormData({ ...formData, fuel: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Kraftstoff wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Benzin">Benzin</SelectItem>
                          <SelectItem value="Diesel">Diesel</SelectItem>
                          <SelectItem value="Elektro">Elektro</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                          <SelectItem value="Erdgas">Erdgas</SelectItem>
                          <SelectItem value="Autogas">Autogas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transmission">Getriebe</Label>
                      <Select
                        value={formData.transmission}
                        onValueChange={(value) =>
                          setFormData({ ...formData, transmission: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Getriebe wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Manuell">Manuell</SelectItem>
                          <SelectItem value="Automatik">Automatik</SelectItem>
                          <SelectItem value="Halbautomatik">
                            Halbautomatik
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="power">Leistung</Label>
                      <input
                        id="power"
                        value={formData.power}
                        onChange={(e) =>
                          setFormData({ ...formData, power: e.target.value })
                        }
                        placeholder="190 PS"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="displacement">Hubraum</Label>
                      <input
                        id="displacement"
                        value={formData.displacement}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            displacement: e.target.value,
                          })
                        }
                        placeholder="2.0L"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color">Farbe</Label>
                      <input
                        id="color"
                        value={formData.color}
                        onChange={(e) =>
                          setFormData({ ...formData, color: e.target.value })
                        }
                        placeholder="Schwarz Metallic"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doors">Türen</Label>
                      <Select
                        value={formData.doors}
                        onValueChange={(value) =>
                          setFormData({ ...formData, doors: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Anzahl Türen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seats">Sitzplätze</Label>
                      <Select
                        value={formData.seats}
                        onValueChange={(value) =>
                          setFormData({ ...formData, seats: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Anzahl Sitzplätze" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="7">7</SelectItem>
                          <SelectItem value="8">8</SelectItem>
                          <SelectItem value="9">9</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="equipment" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <EquipmentSelector
                      category="comfort"
                      title="Komfort"
                      options={equipmentOptions.comfort}
                      selected={formData.equipment.comfort}
                      onChange={handleEquipmentChange}
                    />
                    <EquipmentSelector
                      category="safety"
                      title="Sicherheit"
                      options={equipmentOptions.safety}
                      selected={formData.equipment.safety}
                      onChange={handleEquipmentChange}
                    />
                    <EquipmentSelector
                      category="multimedia"
                      title="Multimedia & Navigation"
                      options={equipmentOptions.multimedia}
                      selected={formData.equipment.multimedia}
                      onChange={handleEquipmentChange}
                    />
                    <EquipmentSelector
                      category="exterior"
                      title="Exterieur"
                      options={equipmentOptions.exterior}
                      selected={formData.equipment.exterior}
                      onChange={handleEquipmentChange}
                    />
                    <div className="lg:col-span-2">
                      <EquipmentSelector
                        category="engineTransmission"
                        title="Motor & Getriebe"
                        options={equipmentOptions.engineTransmission}
                        selected={formData.equipment.engineTransmission}
                        onChange={handleEquipmentChange}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="images" className="space-y-4">
                  <ImageGallery
                    images={formData.images}
                    onImagesChange={(images) =>
                      setFormData({ ...formData, images })
                    }
                  />
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="condition">Zustand</Label>
                      <Select
                        value={formData.condition}
                        onValueChange={(value) =>
                          setFormData({ ...formData, condition: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Zustand wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Neuwertig">Neuwertig</SelectItem>
                          <SelectItem value="Sehr gut">Sehr gut</SelectItem>
                          <SelectItem value="Gut">Gut</SelectItem>
                          <SelectItem value="Gebraucht">Gebraucht</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="previousOwners">Vorbesitzer</Label>
                      <input
                        id="previousOwners"
                        type="number"
                        value={formData.previousOwners}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            previousOwners: e.target.value,
                          })
                        }
                        placeholder="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="inspectionDate">Letzte Inspektion</Label>
                      <input
                        id="inspectionDate"
                        type="date"
                        value={formData.inspectionDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            inspectionDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registrationDate">Erstzulassung</Label>
                      <input
                        id="registrationDate"
                        type="date"
                        value={formData.registrationDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            registrationDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tuv">TÜV</Label>
                      <input
                        id="tuv"
                        value={formData.tuv}
                        onChange={(e) =>
                          setFormData({ ...formData, tuv: e.target.value })
                        }
                        placeholder="TÜV bis 08/2026"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Standort</Label>
                      <input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="Berlin"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Ansprechpartner</Label>
                      <input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactPerson: e.target.value,
                          })
                        }
                        placeholder="Max Mustermann"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="warranty">Garantie</Label>
                      <input
                        id="warranty"
                        value={formData.warranty}
                        onChange={(e) =>
                          setFormData({ ...formData, warranty: e.target.value })
                        }
                        placeholder="12 Monate Garantie"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="financing">Finanzierung</Label>
                      <input
                        id="financing"
                        value={formData.financing}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            financing: e.target.value,
                          })
                        }
                        placeholder="Finanzierung möglich ab 199€/Monat"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Beschreibung</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Ausführliche Beschreibung des Fahrzeugs..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">Interne Notizen</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        placeholder="Interne Notizen..."
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-6 md:col-span-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.accidentFree}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              accidentFree: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          Unfallfrei
                        </span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.nonsmoker}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nonsmoker: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          Nichtraucherfahrzeug
                        </span>
                      </label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}
                >
                  Abbrechen
                </Button>
                <Button onClick={handleAddCar}>
                  <Save className="h-4 w-4 mr-2" />
                  Speichern
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cars List */}
        <div className="space-y-6">
          {cars.map((car) => (
            <Card key={car.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-full lg:w-64">
                    <img
                      src={
                        car.images[0] ||
                        "https://via.placeholder.com/300x200?text=Kein+Bild"
                      }
                      alt={car.title}
                      className="w-full h-48 lg:h-40 object-cover rounded-lg"
                      onError={(
                        e: React.SyntheticEvent<HTMLImageElement, Event>
                      ) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/300x200?text=Bild+nicht+verfügbar";
                      }}
                    />
                    {car.images.length > 1 && (
                      <div className="flex gap-1 mt-2 overflow-x-auto">
                        {car.images.slice(1, 4).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${car.title} ${index + 2}`}
                            className="w-16 h-12 object-cover rounded flex-shrink-0"
                            onError={(
                              e: React.SyntheticEvent<HTMLImageElement, Event>
                            ) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/60x40?text=?";
                            }}
                          />
                        ))}
                        {car.images.length > 4 && (
                          <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                            +{car.images.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {car.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {car.brand} {car.model}
                        </p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">
                          {car.price.toLocaleString("de-DE")} €
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCar(car)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCar(car.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div>Jahr: {car.year}</div>
                      <div>KM: {car.mileage.toLocaleString("de-DE")}</div>
                      <div>Kraftstoff: {car.fuel}</div>
                      <div>Getriebe: {car.transmission}</div>
                      <div>Leistung: {car.power}</div>
                      <div>Hubraum: {car.displacement}</div>
                      <div>Farbe: {car.color}</div>
                      <div>Zustand: {car.condition}</div>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(car.equipment).map(
                        ([category, items]) =>
                          items.length > 0 && (
                            <div key={category}>
                              <h5 className="text-sm font-medium text-gray-700 mb-1">
                                {category === "comfort" && "Komfort"}
                                {category === "safety" && "Sicherheit"}
                                {category === "multimedia" && "Multimedia"}
                                {category === "exterior" && "Exterieur"}
                                {category === "engineTransmission" &&
                                  "Motor & Getriebe"}
                                ({items.length})
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {items.slice(0, 8).map((item, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {item}
                                  </Badge>
                                ))}
                                {items.length > 8 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{items.length - 8} weitere
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )
                      )}
                    </div>

                    {car.description && (
                      <p className="text-gray-600 text-sm mt-4 line-clamp-3">
                        {car.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                      {car.accidentFree && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Unfallfrei
                        </div>
                      )}
                      {car.nonsmoker && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Nichtraucher
                        </div>
                      )}
                      {car.tuv && <div>{car.tuv}</div>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {cars.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Noch keine Fahrzeuge vorhanden
              </h3>
              <p className="text-gray-600 mb-4">
                Fügen Sie Ihr erstes Fahrzeug mit umfangreicher Ausstattung
                hinzu.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Erstes Fahrzeug hinzufügen
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog - Similar structure to Add Dialog */}
      {editingCar && (
        <Dialog
          open={!!editingCar}
          onOpenChange={() => {
            setEditingCar(null);
            resetForm();
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Fahrzeug bearbeiten</DialogTitle>
              <DialogDescription>
                Bearbeiten Sie die Details des Fahrzeugs.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Grunddaten</TabsTrigger>
                <TabsTrigger value="equipment">Ausstattung</TabsTrigger>
                <TabsTrigger value="images">Bilder</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-brand">Marke *</Label>
                    <input
                      id="edit-brand"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-model">Modell *</Label>
                    <input
                      id="edit-model"
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="edit-title">Vollständiger Titel *</Label>
                    <input
                      id="edit-title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Preis (€) *</Label>
                    <input
                      id="edit-price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-year">Baujahr</Label>
                    <input
                      id="edit-year"
                      type="number"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-mileage">Kilometerstand</Label>
                    <input
                      id="edit-mileage"
                      type="number"
                      value={formData.mileage}
                      onChange={(e) =>
                        setFormData({ ...formData, mileage: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-fuel">Kraftstoff</Label>
                    <Select
                      value={formData.fuel}
                      onValueChange={(value) =>
                        setFormData({ ...formData, fuel: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Benzin">Benzin</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Elektro">Elektro</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Erdgas">Erdgas</SelectItem>
                        <SelectItem value="Autogas">Autogas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-transmission">Getriebe</Label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value) =>
                        setFormData({ ...formData, transmission: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manuell">Manuell</SelectItem>
                        <SelectItem value="Automatik">Automatik</SelectItem>
                        <SelectItem value="Halbautomatik">
                          Halbautomatik
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-power">Leistung</Label>
                    <input
                      id="edit-power"
                      value={formData.power}
                      onChange={(e) =>
                        setFormData({ ...formData, power: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-color">Farbe</Label>
                    <input
                      id="edit-color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="equipment" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <EquipmentSelector
                    category="comfort"
                    title="Komfort"
                    options={equipmentOptions.comfort}
                    selected={formData.equipment.comfort}
                    onChange={handleEquipmentChange}
                  />
                  <EquipmentSelector
                    category="safety"
                    title="Sicherheit"
                    options={equipmentOptions.safety}
                    selected={formData.equipment.safety}
                    onChange={handleEquipmentChange}
                  />
                  <EquipmentSelector
                    category="multimedia"
                    title="Multimedia & Navigation"
                    options={equipmentOptions.multimedia}
                    selected={formData.equipment.multimedia}
                    onChange={handleEquipmentChange}
                  />
                  <EquipmentSelector
                    category="exterior"
                    title="Exterieur"
                    options={equipmentOptions.exterior}
                    selected={formData.equipment.exterior}
                    onChange={handleEquipmentChange}
                  />
                  <div className="lg:col-span-2">
                    <EquipmentSelector
                      category="engineTransmission"
                      title="Motor & Getriebe"
                      options={equipmentOptions.engineTransmission}
                      selected={formData.equipment.engineTransmission}
                      onChange={handleEquipmentChange}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="images" className="space-y-4">
                <ImageGallery
                  images={formData.images}
                  onImagesChange={(images) =>
                    setFormData({ ...formData, images })
                  }
                />
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-condition">Zustand</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) =>
                        setFormData({ ...formData, condition: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Neuwertig">Neuwertig</SelectItem>
                        <SelectItem value="Sehr gut">Sehr gut</SelectItem>
                        <SelectItem value="Gut">Gut</SelectItem>
                        <SelectItem value="Gebraucht">Gebraucht</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-previousOwners">Vorbesitzer</Label>
                    <input
                      id="edit-previousOwners"
                      type="number"
                      value={formData.previousOwners}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          previousOwners: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="edit-description">Beschreibung</Label>
                    <Textarea
                      id="edit-description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center space-x-6 md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.accidentFree}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            accidentFree: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Unfallfrei</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.nonsmoker}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nonsmoker: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Nichtraucherfahrzeug
                      </span>
                    </label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingCar(null);
                  resetForm();
                }}
              >
                Abbrechen
              </Button>
              <Button onClick={handleUpdateCar}>
                <Save className="h-4 w-4 mr-2" />
                Aktualisieren
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
