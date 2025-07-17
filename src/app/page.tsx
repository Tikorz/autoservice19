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
  Wrench,
  Car,
  Settings,
  Shield,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  Zap,
  Cog,
  Gauge,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const services = [
    {
      icon: <Settings className="h-8 w-8" />,
      title: "KFZ-Reparaturen",
      description: "Professionelle Reparaturen aller Fahrzeugtypen",
      features: ["Motor Reparaturen", "Getriebe Service", "Elektronik"],
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Öl-Wechsel",
      description: "Schneller und zuverlässiger Ölwechsel-Service",
      features: ["Alle Öltypen", "Filter-Wechsel", "30 Min Service"],
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Bremsenwechsel",
      description: "Sicherheit durch professionelle Bremswartung",
      features: ["Bremsscheiben", "Bremsbeläge", "Bremssystem"],
    },
    {
      icon: <Car className="h-8 w-8" />,
      title: "Reifenwechsel",
      description: "Kompletter Reifen- und Felgenservice",
      features: ["Reifenmontage", "Auswuchten", "Einlagerung"],
    },
    {
      icon: <Gauge className="h-8 w-8" />,
      title: "Felgen Service",
      description: "Felgen neu beziehen und Reparaturen",
      features: ["Felgen Lackierung", "Reparaturen", "Aufbereitung"],
    },
    {
      icon: <Cog className="h-8 w-8" />,
      title: "Inspektion & TÜV",
      description: "Hauptuntersuchung und Inspektionsservice",
      features: ["HU/AU", "Jahresinspektion", "Garantie"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                Auto Service 19
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="#services"
                className="text-gray-600 hover:text-blue-600"
              >
                Services
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-blue-600">
                Über uns
              </Link>
              <Link href="/cars" className="text-gray-600 hover:text-blue-600">
                Autohandel
              </Link>
              <Link
                href="#contact"
                className="text-gray-600 hover:text-blue-600"
              >
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            Berlin - Seit 1996
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Auto Service 19
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Ihre vertrauensvolle KFZ-Werkstatt in Berlin. Professionelle
            Reparaturen, schneller Service und faire Preise - alles unter einem
            Dach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Phone className="h-5 w-5 mr-2" />
              Termin vereinbaren
            </Button>
            <Link href="/cars">
              <Button size="lg" variant="outline">
                <Car className="h-5 w-5 mr-2" />
                Unsere Fahrzeuge
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Unsere Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Von der kleinen Reparatur bis zur großen Überholung - wir sind Ihr
              Partner für alle KFZ-Belange in Berlin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-blue-600 mb-4">{service.icon}</div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <Star className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Warum Auto Service 19?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Schneller Service
                    </h3>
                    <p className="text-gray-600">
                      Termingerechte Reparaturen und Express-Services für eilige
                      Fälle.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Qualitätsgarantie
                    </h3>
                    <p className="text-gray-600">
                      Alle Reparaturen mit Garantie und nur Originalteile oder
                      gleichwertige Qualität.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Moderne Ausstattung
                    </h3>
                    <p className="text-gray-600">
                      Neueste Diagnosegeräte und Werkzeuge für alle
                      Fahrzeugmarken.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-slate-100 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Autohandel
              </h3>
              <p className="text-gray-600 mb-6">
                Neben unserem Werkstatt-Service bieten wir auch eine große
                Auswahl an geprüften Gebrauchtwagen. Alle Fahrzeuge werden in
                unserer Werkstatt überprüft und kommen mit Garantie.
              </p>
              <Link href="/cars">
                <Button className="w-full">
                  <Car className="h-5 w-5 mr-2" />
                  Verfügbare Fahrzeuge ansehen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Kontakt & Öffnungszeiten
              </h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <MapPin className="h-6 w-6 text-blue-400" />
                  <div>
                    <p className="font-semibold">Adresse</p>
                    <p className="text-gray-300">Badstraße 34, 13357 Berlin</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-blue-400" />
                  <div>
                    <p className="font-semibold">Telefon</p>
                    <p className="text-gray-300">030 / 493 40 35</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-blue-400" />
                  <div>
                    <p className="font-semibold">E-Mail</p>
                    <p className="text-gray-300">info@autoservice19.de</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">Öffnungszeiten</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Montag - Freitag</span>
                  <span className="text-gray-300">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samstag</span>
                  <span className="text-gray-300">09:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sonntag</span>
                  <span className="text-gray-300">Geschlossen</span>
                </div>
              </div>
              <div className="mt-8">
                <Button
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Jetzt anrufen
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Car className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold">Auto Service 19</span>
          </div>
          <p className="text-gray-400">
            © 2025 Auto Service 19. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
}
