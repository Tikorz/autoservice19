"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Car, Heart, Phone, Share2 } from "lucide-react";
import Link from "next/link";

type Car = {
  id: number;
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
  firstRegistration: string;
  lastService: string;
  nextInspection: string;
  images: string[];
  features: string[];
  description: string;
  condition: string;
  warranty: string;
  financing: string;
  previousOwners: number;
  accidentFree: boolean;
  nonsmoker: boolean;
  equipment: {
    comfort: string[];
    safety: string[];
    entertainment: string[];
    exterior: string[];
  };
};

export default function CarDetailPage() {
  const params = useParams();
  const carId = parseInt(params.id as string);

  const supabase = createClientComponentClient();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    async function fetchCar() {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", carId)
        .single();

      if (error) {
        console.error("Fehler beim Laden des Fahrzeugs:", error.message);
        setCar(null);
      } else {
        setCar(data);
      }
      setLoading(false);
    }

    if (carId) fetchCar();
  }, [carId]);

  if (loading)
    return <div className="p-6 text-center">Lade Fahrzeugdaten...</div>;
  if (!car)
    return (
      <div className="p-6 text-center text-red-600 font-bold">
        Fahrzeug nicht gefunden.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              Auto Service 19
            </span>
          </Link>
          <Link href="/cars">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zur Übersicht
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div>
            <div className="relative mb-4">
              <img
                src={car.images[selectedImageIndex]}
                alt={car.title}
                className="w-full h-72 object-cover rounded-lg"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={`h-4 w-4 ${isLiked ? "text-red-600" : ""}`}
                  />
                </Button>
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {car.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`h-20 w-full object-cover rounded cursor-pointer border ${
                    selectedImageIndex === index
                      ? "border-blue-600"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{car.title}</h1>
            <p className="text-2xl text-blue-600 font-semibold mb-4">
              {car.price.toLocaleString("de-DE")} €
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
              <div className="flex justify-between">
                <span>Erstzulassung</span>
                <span>{car.firstRegistration}</span>
              </div>
              <div className="flex justify-between">
                <span>Kilometerstand</span>
                <span>{car.mileage.toLocaleString("de-DE")} km</span>
              </div>
              <div className="flex justify-between">
                <span>Leistung</span>
                <span>{car.power}</span>
              </div>
              <div className="flex justify-between">
                <span>Hubraum</span>
                <span>{car.displacement}</span>
              </div>
              <div className="flex justify-between">
                <span>Kraftstoff</span>
                <span>{car.fuel}</span>
              </div>
              <div className="flex justify-between">
                <span>Getriebe</span>
                <span>{car.transmission}</span>
              </div>
              <div className="flex justify-between">
                <span>Farbe</span>
                <span>{car.color}</span>
              </div>
              <div className="flex justify-between">
                <span>Türen / Sitze</span>
                <span>
                  {car.doors} / {car.seats}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Letzter Service</span>
                <span>{car.lastService}</span>
              </div>
              <div className="flex justify-between">
                <span>HU gültig bis</span>
                <span>{car.nextInspection}</span>
              </div>
              <div className="flex justify-between">
                <span>Vorbesitzer</span>
                <span>{car.previousOwners}</span>
              </div>
              <div className="flex justify-between">
                <span>Zustand</span>
                <Badge
                  className={
                    car.condition === "Sehr gut"
                      ? "bg-green-600 text-white"
                      : car.condition === "Gut"
                      ? "bg-yellow-500 text-white"
                      : "bg-red-600 text-white"
                  }
                >
                  {car.condition}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Unfallfrei</span>
                <span>{car.accidentFree ? "Ja" : "Nein"}</span>
              </div>
              <div className="flex justify-between">
                <span>Nichtraucher</span>
                <span>{car.nonsmoker ? "Ja" : "Nein"}</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Ausstattung</h2>
              <div className="grid grid-cols-2 gap-1 text-sm">
                {[
                  ...car.features,
                  ...car.equipment.comfort,
                  ...car.equipment.safety,
                  ...car.equipment.entertainment,
                  ...car.equipment.exterior,
                ].map((feature, idx) => (
                  <span key={idx} className="text-gray-700">
                    • {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Beschreibung</h2>
              <p className="text-gray-700 text-sm whitespace-pre-line">
                {car.description}
              </p>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                className="w-full"
                onClick={() => (window.location.href = "tel:+49304934035")}
              >
                <Phone className="h-4 w-4 mr-2" />
                030 / 493 40 35
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "tel:+49304934035")}
              >
                Beratung anfordern
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
