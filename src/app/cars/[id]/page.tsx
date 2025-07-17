"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Car,
  ArrowLeft,
  Calendar,
  MapPin,
  Fuel,
  Settings,
  Phone,
  Mail,
  Heart,
  Share2,
  Euro,
  Clock,
  Shield,
  FileText,
  Camera,
  Star,
} from "lucide-react";
import Link from "next/link";

// Extended car data with multiple images
const carsData = [
  {
    id: 1,
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
    firstRegistration: "03/2018",
    lastService: "12/2023",
    nextInspection: "03/2025",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606611122017-be30c0c43b6b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
    ],
    features: [
      "Navi",
      "Klimaautomatik",
      "Xenon",
      "Ledersitze",
      "PDC",
      "Tempomat",
      "Bluetooth",
      "USB",
    ],
    description:
      "Gepflegter BMW 3er Touring mit umfangreicher Ausstattung. Das Fahrzeug befindet sich in einem sehr guten Zustand und wurde regelmäßig in unserer Werkstatt gewartet. Alle Wartungen wurden fristgerecht durchgeführt.",
    condition: "Sehr gut",
    warranty: "12 Monate Garantie",
    financing: "Finanzierung möglich ab 199€/Monat",
    previousOwners: 2,
    accidentFree: true,
    nonsmoker: true,
    equipment: {
      comfort: [
        "Klimaautomatik",
        "Tempomat",
        "Elektrische Fensterheber",
        "Zentralverriegelung",
      ],
      safety: ["ABS", "ESP", "Airbags", "Bremsassistent", "PDC hinten"],
      entertainment: [
        "Navigationssystem",
        "Bluetooth",
        "USB-Anschluss",
        "CD-Player",
      ],
      exterior: [
        "Xenon Scheinwerfer",
        "Metallic Lackierung",
        "Leichtmetallfelgen",
        "Nebelscheinwerfer",
      ],
    },
  },
  {
    id: 2,
    title: "Audi A4 Avant 2.0 TDI",
    price: 22500,
    year: 2019,
    mileage: 65000,
    fuel: "Diesel",
    transmission: "Manuell",
    power: "150 PS",
    displacement: "2.0L",
    color: "Silber Metallic",
    doors: 5,
    seats: 5,
    firstRegistration: "06/2019",
    lastService: "10/2023",
    nextInspection: "06/2025",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
    ],
    features: ["Quattro", "MMI", "PDC", "SHZ"],
    description: "Sportlicher Audi A4 Avant mit Quattro-Allradantrieb.",
    condition: "Sehr gut",
    warranty: "12 Monate Garantie",
    financing: "Finanzierung möglich ab 249€/Monat",
    previousOwners: 1,
    accidentFree: true,
    nonsmoker: true,
    equipment: {
      comfort: ["Sitzheizung", "Tempomat", "Elektrische Fensterheber"],
      safety: ["ABS", "ESP", "Airbags", "PDC"],
      entertainment: ["MMI", "Bluetooth", "USB"],
      exterior: ["Quattro", "Metallic", "Leichtmetallfelgen"],
    },
  },
];

export default function CarDetailPage() {
  const params = useParams();
  const carId = parseInt(params.id as string);
  const car = carsData.find((c) => c.id === carId);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  if (!car) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Fahrzeug nicht gefunden
          </h1>
          <p className="text-gray-600 mb-4">
            Das gesuchte Fahrzeug existiert nicht.
          </p>
          <Link href="/cars">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zur Übersicht
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
              <Link href="/cars">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Alle Fahrzeuge
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {car.title}
            </h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {car.year}
              </span>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {car.mileage.toLocaleString("de-DE")} km
              </span>
              <span className="flex items-center">
                <Fuel className="h-4 w-4 mr-1" />
                {car.fuel}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">
                {car.price.toLocaleString("de-DE")} €
              </p>
              <p className="text-sm text-gray-600">{car.financing}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? "text-red-500" : ""}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={car.images[selectedImageIndex]}
                    alt={`${car.title} - Bild ${selectedImageIndex + 1}`}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-4 left-4 bg-green-600">
                    Verfügbar
                  </Badge>
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    <Camera className="h-4 w-4 inline mr-1" />
                    {selectedImageIndex + 1} / {car.images.length}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                <div className="p-4">
                  <div className="grid grid-cols-5 gap-2">
                    {car.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? "border-blue-600"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-16 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Fahrzeugdetails</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="specs" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="specs">Technische Daten</TabsTrigger>
                    <TabsTrigger value="equipment">Ausstattung</TabsTrigger>
                    <TabsTrigger value="history">Historie</TabsTrigger>
                  </TabsList>

                  <TabsContent value="specs" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Leistung
                        </p>
                        <p className="text-lg">{car.power}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Hubraum
                        </p>
                        <p className="text-lg">{car.displacement}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Farbe
                        </p>
                        <p className="text-lg">{car.color}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Türen
                        </p>
                        <p className="text-lg">{car.doors}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Sitzplätze
                        </p>
                        <p className="text-lg">{car.seats}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Getriebe
                        </p>
                        <p className="text-lg">{car.transmission}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="equipment" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Komfort
                        </h4>
                        <div className="space-y-2">
                          {car.equipment.comfort.map((item, index) => (
                            <div key={index} className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-2" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Sicherheit
                        </h4>
                        <div className="space-y-2">
                          {car.equipment.safety.map((item, index) => (
                            <div key={index} className="flex items-center">
                              <Shield className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Entertainment
                        </h4>
                        <div className="space-y-2">
                          {car.equipment.entertainment.map((item, index) => (
                            <div key={index} className="flex items-center">
                              <Settings className="h-4 w-4 text-blue-500 mr-2" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Exterieur
                        </h4>
                        <div className="space-y-2">
                          {car.equipment.exterior.map((item, index) => (
                            <div key={index} className="flex items-center">
                              <Car className="h-4 w-4 text-gray-600 mr-2" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Fahrzeughistorie
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Erstzulassung
                            </span>
                            <span className="text-sm font-medium">
                              {car.firstRegistration}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Vorbesitzer
                            </span>
                            <span className="text-sm font-medium">
                              {car.previousOwners}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Unfallfrei
                            </span>
                            <Badge
                              variant={
                                car.accidentFree ? "default" : "destructive"
                              }
                            >
                              {car.accidentFree ? "Ja" : "Nein"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Nichtraucher
                            </span>
                            <Badge
                              variant={car.nonsmoker ? "default" : "secondary"}
                            >
                              {car.nonsmoker ? "Ja" : "Nein"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Service & Wartung
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Letzter Service
                            </span>
                            <span className="text-sm font-medium">
                              {car.lastService}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Nächste HU
                            </span>
                            <span className="text-sm font-medium">
                              {car.nextInspection}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Zustand
                            </span>
                            <Badge variant="default">{car.condition}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Garantie
                            </span>
                            <span className="text-sm font-medium">
                              {car.warranty}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Contact Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Interesse an diesem Fahrzeug?</CardTitle>
                <CardDescription>
                  Kontaktieren Sie uns für eine Probefahrt oder weitere
                  Informationen.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {car.price.toLocaleString("de-DE")} €
                  </p>
                  <p className="text-sm text-gray-600">
                    Finanzierung ab {car.financing.split(" ").pop()}
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    onClick={() => (window.location.href = "tel:+49304934035")}
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    030 / 493 40 35
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Mail className="h-5 w-5 mr-2" />
                    E-Mail senden
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Clock className="h-5 w-5 mr-2" />
                    Probefahrt vereinbaren
                  </Button>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="h-4 w-4 mr-2 text-green-500" />
                    {car.warranty}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Euro className="h-4 w-4 mr-2 text-blue-500" />
                    Finanzierung verfügbar
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    Alle Dokumente verfügbar
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Beschreibung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {car.description}
                </p>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Auto Service 19</CardTitle>
                <CardDescription>Ihr vertrauensvoller Partner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">Badstraße 34, 13357 Berlin</span>
                </div>
                <div className="flex items-center">
                  <Phone
                    className="h-4 w-4 text-gray-500 mr-2"
                    onClick={() => (window.location.href = "tel:+49304934035")}
                  />
                  <span className="text-sm">030 / 493 40 35</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">info@autoservice19.de</span>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-gray-500">
                    Mo-Fr: 09:00-18:00 • Sa: 09:00-14:00
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
