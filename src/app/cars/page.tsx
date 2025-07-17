"use client";

import { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Search,
  Filter,
  Fuel,
  Calendar,
  MapPin,
  Phone,
  ArrowLeft,
  Heart,
  Share2,
} from "lucide-react";
import Link from "next/link";

// Mock car data
const cars = [
  {
    id: 1,
    title: "BMW 3er 320d Touring",
    price: 18900,
    year: 2018,
    mileage: 85000,
    fuel: "Diesel",
    transmission: "Automatik",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop",
    ],
    features: ["Navi", "Klimaautomatik", "Xenon", "Ledersitze"],
  },
  {
    id: 2,
    title: "Audi A4 Avant 2.0 TDI",
    price: 22500,
    year: 2019,
    mileage: 65000,
    fuel: "Diesel",
    transmission: "Manuell",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop",
    ],
    features: ["Quattro", "MMI", "PDC", "SHZ"],
  },
  {
    id: 3,
    title: "Mercedes C-Klasse T-Modell",
    price: 25900,
    year: 2020,
    mileage: 45000,
    fuel: "Benzin",
    transmission: "Automatik",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&h=300&fit=crop",
    ],
    features: ["MBUX", "AMG Line", "LED", "Kamera"],
  },
  {
    id: 4,
    title: "VW Golf 8 GTI",
    price: 28900,
    year: 2021,
    mileage: 32000,
    fuel: "Benzin",
    transmission: "Manuell",
    images: [
      "https://images.unsplash.com/photo-1606611122017-be30c0c43b6b?w=500&h=300&fit=crop",
    ],
    features: ["GTI Performance", "DCC", "Virtual Cockpit", "Soundsystem"],
  },
  {
    id: 5,
    title: "Audi Q5 40 TDI",
    price: 32900,
    year: 2020,
    mileage: 55000,
    fuel: "Diesel",
    transmission: "Automatik",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop",
    ],
    features: ["Quattro", "S-Line", "Panorama", "Matrix LED"],
  },
  {
    id: 6,
    title: "Ford Focus ST Turnier",
    price: 19900,
    year: 2019,
    mileage: 58000,
    fuel: "Benzin",
    transmission: "Manuell",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop",
    ],
    features: ["ST Performance", "SYNC 3", "Recaro", "Brembo"],
  },
];

export default function CarsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("all");

  const filteredCars = cars.filter((car) => {
    const matchesSearch = car.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFuel =
      selectedFuel === "all" ||
      car.fuel.toLowerCase() === selectedFuel.toLowerCase();
    return matchesSearch && matchesFuel;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                Auto Service 19
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück zur Hauptseite
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Unsere Fahrzeuge
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Geprüfte Gebrauchtwagen mit Garantie. Alle Fahrzeuge werden in
            unserer Werkstatt durchgecheckt und kommen mit 12 Monaten
            Gewährleistung.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              placeholder="Fahrzeug suchen..."
              value={searchTerm}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setSearchTerm(e.target.value)
              }
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedFuel === "all" ? "default" : "outline"}
              onClick={() => setSelectedFuel("all")}
              size="sm"
            >
              Alle
            </Button>
            <Button
              variant={selectedFuel === "benzin" ? "default" : "outline"}
              onClick={() => setSelectedFuel("benzin")}
              size="sm"
            >
              <Fuel className="h-4 w-4 mr-1" />
              Benzin
            </Button>
            <Button
              variant={selectedFuel === "diesel" ? "default" : "outline"}
              onClick={() => setSelectedFuel("diesel")}
              size="sm"
            >
              <Fuel className="h-4 w-4 mr-1" />
              Diesel
            </Button>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredCars.map((car) => (
            <Card
              key={car.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={car.images[0]}
                  alt={car.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <Badge className="absolute bottom-2 left-2 bg-blue-600">
                  Geprüft
                </Badge>
              </div>

              <CardHeader>
                <CardTitle className="text-lg">{car.title}</CardTitle>
                <CardDescription className="text-2xl font-bold text-blue-600">
                  {car.price.toLocaleString("de-DE")} €
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {car.year}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {car.mileage.toLocaleString("de-DE")} km
                  </div>
                  <div className="flex items-center">
                    <Fuel className="h-4 w-4 mr-2" />
                    {car.fuel}
                  </div>
                  <div className="flex items-center">
                    <Car className="h-4 w-4 mr-2" />
                    {car.transmission}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Ausstattung:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {car.features.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/cars/${car.id}`} className="flex-1">
                    <Button className="w-full">Details ansehen</Button>
                  </Link>
                  <Button variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-br from-blue-50 to-slate-100 p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Interesse an einem Fahrzeug?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Vereinbaren Sie einen Besichtigungstermin oder lassen Sie sich von
            unserem Team beraten. Wir freuen uns auf Ihren Besuch!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Phone
                className="h-5 w-5 mr-2"
                onClick={() => (window.location.href = "tel:+49304934035")}
              />
              030 / 493 40 35
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => (window.location.href = "tel:+49304934035")}
            >
              Beratungstermin vereinbaren
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
