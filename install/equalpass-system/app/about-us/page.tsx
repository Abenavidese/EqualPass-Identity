import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, GraduationCap, Users, Globe, Heart, Linkedin, Mail, Phone } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-5">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" aria-label="Volver">
              <BackButton />
            </Link>
            <div className="flex items-center gap-3">
              <Image src="/logo_zks.png" alt="EqualPass Logo" width={32} height={32} className="h-8 w-8" />
              <h1 className="text-2xl font-semibold">Sobre Nosotros</h1>
            </div>
          </div>
        </div>
        {/* Barra de acento */}
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" />
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <Badge className="bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20 hover:bg-[#22c55e]/20 mb-4">
            Estudiantes • Innovadores • Blockchain Ecuador
          </Badge>
          
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
            Construyendo el Futuro de la Identidad Digital
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Somos estudiantes apasionados de la Universidad Politécnica Salesiana, comprometidos con traer 
            tecnología blockchain innovadora a Ecuador y revolucionar la verificación de identidad estudiantil.
          </p>
        </section>

        {/* Mission Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-400/10 to-emerald-400/10 rounded-3xl blur-3xl" />
          <Card className="relative border bg-background/60 backdrop-blur-md">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl">Nuestra Misión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed">
                    Estamos entusiasmados por democratizar el acceso a tecnologías de verificación de identidad 
                    preservando la privacidad. Queremos traer esta innovación a la realidad y hacer que Ecuador 
                    sea un referente en adopción blockchain en Latinoamérica.
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="h-5 w-5" />
                    <span>Impactando desde Ecuador hacia el mundo</span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-full blur-xl" />
                    <div className="relative bg-gradient-to-r from-blue-500 to-emerald-500 p-8 rounded-full">
                      <Users className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Vision Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">¿Por qué Ecuador On-Chain?</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Ecuador tiene un potencial enorme en el ecosistema blockchain, pero aún hay pocas iniciativas. 
              Queremos cambiar eso, empezando por la educación superior.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border bg-background/60 backdrop-blur-sm hover:shadow-lg transition-all">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-2">
                  <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">Educación</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Democratizar el acceso a verificación de credenciales académicas para todos los estudiantes ecuatorianos.
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-background/60 backdrop-blur-sm hover:shadow-lg transition-all">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-2">
                  <Globe className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <CardTitle className="text-xl">Innovación</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Posicionar a Ecuador como líder en adopción de tecnologías blockchain en la región.
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-background/60 backdrop-blur-sm hover:shadow-lg transition-all">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-xl">Comunidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Construir una comunidad de desarrolladores blockchain comprometidos con el futuro digital.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Nuestro Equipo</h2>
            <p className="text-lg text-muted-foreground">
              Dos estudiantes con una visión compartida de transformar la identidad digital en Ecuador
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Anthony */}
            <Card className="border bg-background/60 backdrop-blur-sm hover:shadow-xl transition-all group">
              <CardHeader className="text-center space-y-4">
                <div className="relative mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                  <Image
                    src="/anthony.jpg"
                    alt="Anthony Benavides"
                    width={120}
                    height={120}
                    className="relative w-30 h-30 rounded-full object-cover border-4 border-white/10 shadow-lg"
                  />
                </div>
                <div>
                  <CardTitle className="text-2xl">Anthony Benavides</CardTitle>
                  <CardDescription className="text-lg">Co-Fundador & Lead Developer</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Cuenca, Ecuador</span>
                </div>
                
                <p className="text-sm leading-relaxed">
                  Estudiante de Ingeniería en Computación (UPS), Core Team Member de ETH Ecuador, 
                  y ganador del track ZAMA en Aleph Hackathon 2025. Apasionado por Web3, AI y el desarrollo 
                  de soluciones que impacten positivamente en la sociedad.
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Logros Destacados:</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Winner Aleph Hackathon ZAMA Track (190+ proyectos)</li>
                    <li>• Grantee Supermoon Meridian Program 2025</li>
                    <li>• Experiencia en EMV® Standards y sistemas de pago</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-2">

                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.linkedin.com/in/anthonybenavides-dev" target="_blank">
                      <Linkedin className="h-4 w-4 mr-1" />
                      LinkedIn
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Erika */}
            <Card className="border bg-background/60 backdrop-blur-sm hover:shadow-xl transition-all group">
              <CardHeader className="text-center space-y-4">
                <div className="relative mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                  <Image
                    src="/erika.jpg"
                    alt="Erika Cristina Villa"
                    width={120}
                    height={120}
                    className="relative w-30 h-30 rounded-full object-cover border-4 border-white/10 shadow-lg"
                  />
                </div>
                <div>
                  <CardTitle className="text-2xl">Erika Cristina Villa</CardTitle>
                  <CardDescription className="text-lg">Co-Fundadora & Security Expert</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Cuenca, Ecuador</span>
                </div>
                
                <p className="text-sm leading-relaxed">
                  Estudiante de Ingeniería en Ciencias de la Computación (UPS), especializada en 
                  ciberseguridad y desarrollo web. Con experiencia en InitGrammers y pasión por 
                  la innovación tecnológica y la resolución creativa de problemas.
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Especialidades:</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Desarrollo Web Full-Stack (JavaScript, Python, Java)</li>
                    <li>• Fundamentos de Ciberseguridad</li>
                    <li>• Machine Learning & Vertex AI</li>
                    <li>• Internet de las Cosas (IoT)</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Experiencia:</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Desarrollador Web en InitGrammers (2025)</li>
                    <li>• Certificada en ML Solutions on Vertex AI</li>
                    <li>• Especialista en redes y comunicaciones</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-2">

                  <Button variant="outline" size="sm" asChild>
                    <a href="https://linkedin.com/in/erika-villa-a63379120" target="_blank">
                      <Linkedin className="h-4 w-4 mr-1" />
                      LinkedIn
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* University Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-400/10 to-cyan-400/10 rounded-3xl blur-3xl" />
          <Card className="relative border bg-background/60 backdrop-blur-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Universidad Politécnica Salesiana</CardTitle>
              <CardDescription className="text-lg">Formando profesionales comprometidos con la innovación</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Como estudiantes de la UPS, hemos desarrollado las competencias técnicas y el compromiso social 
                necesarios para crear soluciones que beneficien a nuestra comunidad. La universidad nos ha 
                proporcionado la base sólida en ingeniería y el enfoque humanístico que caracteriza este proyecto.
              </p>
              <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>Cuenca, Ecuador • Ingeniería en Computación</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center space-y-6 py-12">
          <h2 className="text-3xl font-bold">¿Listo para ser parte del cambio?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Únete a nosotros en esta misión de transformar la verificación de identidad en Ecuador 
            y llevar blockchain a más estudiantes y universidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600">
              <Link href="/demo">Prueba EqualPass</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/verifier">Ver Verificador</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}