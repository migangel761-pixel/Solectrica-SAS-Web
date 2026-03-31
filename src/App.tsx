/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  Menu, X, ChevronDown, ArrowRight, MessageCircle, 
  Zap, Building2, TrendingUp, CheckCircle2, 
  Clock, Percent, DollarSign, Mail, Phone, MapPin
} from 'lucide-react';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Sobre Nosotros', href: '#nosotros' },
    { name: 'Soluciones', href: '#soluciones', hasDropdown: true },
    { name: 'Blog', href: '#blog' },
    { name: 'Contacto', href: '#contacto' },
  ];

  const solutions = [
    { name: 'Herramienta (Jessy)', href: '#soluciones', desc: 'Monitoreo IoT + IA' },
    { name: 'Infraestructura', href: '#soluciones', desc: 'Diseño y construcción' },
    { name: 'Generación', href: '#soluciones', desc: 'Energía renovable' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'h-[60px] glass-dark shadow-2xl' : 'h-[80px] bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold text-white tracking-tighter">
            SOL<span className="text-gold">É</span>CTRICA
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              {link.hasDropdown ? (
                <button 
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-1 text-lavender hover:text-gold text-sm font-medium transition-colors py-4"
                >
                  {link.name} <ChevronDown className="w-4 h-4" />
                  {/* Dropdown */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-b-lg overflow-hidden py-2"
                      >
                        {solutions.map((sol) => (
                          <a 
                            key={sol.name} 
                            href={sol.href}
                            className="block px-4 py-3 hover:bg-off-white transition-colors"
                          >
                            <div className="text-navy font-bold text-sm flex items-center gap-2">
                              <span className="text-gold">◆</span> {sol.name}
                            </div>
                            <div className="text-muted text-xs mt-1">{sol.desc}</div>
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              ) : (
                <a 
                  href={link.href}
                  className="text-lavender hover:text-gold text-sm font-medium transition-colors"
                >
                  {link.name}
                </a>
              )}
            </div>
          ))}
          <a 
            href="#contacto" 
            className="bg-gold hover:bg-gold-d text-navy px-6 py-2 rounded-sm text-sm font-bold uppercase tracking-wider transition-all"
          >
            Diagnóstico gratuito
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-navy border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <a 
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white text-lg font-medium"
                  >
                    {link.name}
                  </a>
                  {link.hasDropdown && (
                    <div className="mt-4 ml-4 flex flex-col gap-3">
                      {solutions.map((sol) => (
                        <a 
                          key={sol.name} 
                          href={sol.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="text-lavender text-sm"
                        >
                          ◆ {sol.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a 
                href="#contacto"
                onClick={() => setIsMenuOpen(false)}
                className="bg-gold text-navy text-center py-3 rounded-sm font-bold uppercase tracking-wider"
              >
                Diagnóstico gratuito
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Counter = ({ value, suffix = "", duration = 1500 }: any) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [hasStarted, value, duration]);

  return <span ref={nodeRef}>{count}{suffix}</span>;
};

const Hero = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center parallax-bg"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1920")',
            filter: 'brightness(0.3)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/40 to-navy"></div>
        <div className="absolute inset-0 grid-lines opacity-10"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-block glass px-4 py-1 rounded-full mb-8"
        >
          <div className="text-gold font-bold text-[10px] uppercase tracking-[0.3em]">
            Ingeniería energética · Colombia
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white text-6xl md:text-8xl lg:text-9xl max-w-5xl leading-[0.95] mb-8 font-display font-black"
        >
          Energía que <span className="text-gradient-gold">impulsa</span> su futuro
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lavender/80 text-xl md:text-2xl font-light max-w-2xl leading-relaxed mb-12"
        >
          Transformamos el gasto energético en una ventaja competitiva real. Control inteligente, infraestructura de clase mundial y generación sostenible.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 mb-24"
        >
          <a 
            href="#contacto" 
            className="bg-gold hover:bg-white text-navy px-10 py-5 rounded-full font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(223,189,33,0.3)] hover:shadow-[0_0_30px_rgba(223,189,33,0.5)] group"
          >
            Solicitar diagnóstico <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </a>
          <a 
            href="#soluciones" 
            className="glass hover:bg-white/20 text-white px-10 py-5 rounded-full font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-3"
          >
            Ver soluciones
          </a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16"
        >
          {[
            { val: "48", suf: "h", label: "Respuesta" },
            { val: "30", suf: "%", label: "Ahorro" },
            { val: "100", suf: "%", label: "Garantía" },
            { val: "0", suf: "$", label: "Inversión inicial" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col">
              <div className="text-white text-4xl md:text-6xl font-display font-black mb-1">
                <Counter value={stat.val} suffix={stat.suf} />
              </div>
              <div className="text-gold/60 text-[10px] font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/20 hidden md:block">
        <ChevronDown className="w-8 h-8" />
      </div>
    </section>
  );
};

const Problem = () => {
  return (
    <section className="py-24 bg-off-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-navy text-4xl md:text-5xl leading-tight"
          >
            Cada mes que una empresa no optimiza su energía, <span className="text-gold-d">pierde dinero.</span> Silenciosamente. Sin saberlo.
          </motion.h2>
        </div>
        <div className="lg:col-span-7 space-y-6 text-muted text-lg font-light leading-relaxed">
          <p>
            El mercado energético colombiano es complejo, técnico y opaco. Pocas empresas entienden cómo funciona realmente su tarifa, cuándo pueden acceder al mercado no regulado, qué incentivos tributarios existen para sus inversiones, o cómo un sistema de monitoreo puede revelar pérdidas invisibles en su operación.
          </p>
          <p>
            El resultado son millones de pesos que se van en ineficiencias que nunca se miden, en contratos que nunca se negocian y en oportunidades de generación que nunca se estructuran.
          </p>
          <p className="font-medium text-navy">
            A ese problema, Soléctrica le responde con tres cosas concretas: una herramienta, un servicio y una oportunidad.
          </p>
        </div>
      </div>
    </section>
  );
};

const PillarCard = ({ tag, title, desc, quote, image }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="glass-dark rounded-2xl overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 flex flex-col h-full"
  >
    <div className="h-48 overflow-hidden relative">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-60"></div>
      <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-[10px] font-bold text-gold uppercase tracking-widest">
        {tag}
      </div>
    </div>
    <div className="p-8 flex-1 flex flex-col">
      <h3 className="text-white text-2xl mb-4 group-hover:text-gold transition-colors">{title}</h3>
      <p className="text-lavender/60 text-sm leading-relaxed mb-6 flex-1">{desc}</p>
      <div className="border-l-2 border-gold pl-4 py-1 mb-8 italic text-lavender/90 text-sm">
        "{quote}"
      </div>
      <a href="#contacto" className="text-gold text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
        Ver solución <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  </motion.div>
);

const Solutions = () => {
  return (
    <section id="soluciones" className="py-32 bg-navy relative">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-off-white to-transparent opacity-5"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold text-xs font-bold uppercase tracking-[0.3em] mb-4"
          >
            Nuestras Soluciones
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white text-5xl md:text-6xl mb-6"
          >
            Tres naturalezas de <span className="text-gradient-gold">crear valor</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PillarCard 
            tag="Una Herramienta"
            title="Controla tu energía"
            image="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
            desc="Le damos el poder de conocer, monitorear y decidir sobre su consumo en tiempo real. A través de tecnología IoT, inteligencia de datos y acceso al mercado energético."
            quote="Información real. Control real. Decisiones reales."
          />
          <PillarCard 
            tag="Un Servicio"
            title="Infraestructura Eléctrica"
            image="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800"
            desc="Diseñamos, construimos y mantenemos la infraestructura eléctrica de empresas, industrias y proyectos de construcción. Personal certificado, cumplimiento RETIE."
            quote="Su infraestructura, bien hecha desde el principio."
          />
          <PillarCard 
            tag="Una Oportunidad"
            title="Generación e Inversión"
            image="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800"
            desc="Estructuramos proyectos de generación solar y renovables para empresas e inversionistas que quieren producir energía y reducir su dependencia de la red."
            quote="Invierta en energía. Reciba retornos mes a mes."
          />
        </div>
      </div>
    </section>
  );
};

const ProfileCard = ({ title, desc, label, num, image }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col md:flex-row"
  >
    <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="md:w-2/3 p-8 relative">
      <div className="absolute top-4 right-8 text-6xl font-display font-bold text-navy/5 select-none">
        {num}
      </div>
      <div className="text-gold-d text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border-b border-gold/20 pb-2 inline-block">
        {label}
      </div>
      <h3 className="text-navy text-xl mb-4 leading-tight font-bold">{title}</h3>
      <p className="text-muted text-sm leading-relaxed relative z-10">{desc}</p>
    </div>
  </motion.div>
);

const WhoFor = () => {
  return (
    <section id="nosotros" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold-d text-xs font-bold uppercase tracking-[0.3em] mb-4"
          >
            Para quién somos
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-navy text-4xl md:text-5xl mb-6"
          >
            Soléctrica no es para todo el mundo. <span className="text-gold-d">Y eso es intencional.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-lg font-light"
          >
            Somos para empresas y personas que toman decisiones con criterio, que entienden el valor de invertir bien y que buscan aliados estratégicos.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <ProfileCard 
            num="01"
            label="Reducción de costos"
            image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800"
            title="Director financiero o gerente industrial"
            desc="Le importa el costo de la energía porque impacta directo su margen. Quiere entender qué está pagando de más, cómo negociar mejor su tarifa y qué retorno tiene una inversión en eficiencia o generación."
          />
          <ProfileCard 
            num="02"
            label="Infraestructura eléctrica"
            image="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800"
            title="Director de obra o proyectos de construcción"
            desc="Necesita que la infraestructura eléctrica de su proyecto esté bien diseñada, bien construida y a norma. No quiere sorpresas técnicas ni retrasos. Le importa la confiabilidad y el cumplimiento de cronogramas."
          />
          <ProfileCard 
            num="03"
            label="Generación renovable"
            image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
            title="Empresa comercial o corporativa"
            desc="Quiere reducir su huella, cumplir compromisos de sostenibilidad y aprovechar incentivos tributarios. Ve la energía limpia como parte de su propuesta de valor y su imagen de marca."
          />
          <ProfileCard 
            num="04"
            label="Modelo inversionista"
            image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
            title="Inversionista con capital disponible"
            desc="Busca un negocio sólido, con demanda asegurada y retorno claro. Soléctrica le muestra el camino, le estructura el proyecto, se lo construye y lo acompaña en la operación."
          />
        </div>
      </div>
    </section>
  );
};

const Promises = () => {
  const promises = [
    {
      num: "01",
      title: "Le diremos la verdad desde el primer diagnóstico.",
      desc: "Si no hay oportunidad de ahorro real, se lo decimos. Preferiríamos perder una venta antes que perder su confianza."
    },
    {
      num: "02",
      title: "Le hablaremos siempre en su idioma.",
      desc: "No en el de la ingeniería. En el del resultado: cuánto ahorra, cuánto gana, cuándo recupera."
    },
    {
      num: "03",
      title: "Panorama claro en menos de 48 horas.",
      desc: "Si nos contacta, un asesor estará con usted antes de que pasen dos días hábiles. Sin burocracia."
    },
    {
      num: "04",
      title: "Cumplimos lo que prometemos técnicamente.",
      desc: "RETIE no es un trámite para nosotros. Es nuestro estándar mínimo de calidad en cada diseño y montaje."
    },
    {
      num: "05",
      title: "Seguimos con usted después de entregar.",
      desc: "El proyecto no termina en la entrega. Seguimos midiendo, reportando y optimizando."
    }
  ];

  return (
    <section className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-4">
          <div className="text-gold text-xs font-bold uppercase tracking-widest mb-4">Nuestra Promesa</div>
          <h2 className="text-white text-4xl md:text-5xl mb-8 leading-tight">Cinco compromisos que hacemos a cada cliente</h2>
          <p className="text-lavender/60 text-lg font-light mb-10">
            Nada de lo que decimos tiene valor si no se puede medir. Cada proyecto debe poder responder la pregunta: ¿cuánto le mejoró la vida a ese cliente?
          </p>
          <a href="#contacto" className="bg-gold hover:bg-gold-d text-navy px-8 py-4 rounded-sm font-bold uppercase tracking-wider transition-all inline-block">
            Compruébenos → Diagnóstico gratuito
          </a>
        </div>
        <div className="lg:col-span-8 space-y-12">
          {promises.map((p) => (
            <motion.div 
              key={p.num}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-8 group"
            >
              <div className="text-gold font-display text-2xl font-bold opacity-40 group-hover:opacity-100 transition-opacity">{p.num}</div>
              <div className="flex-1 border-b border-lavender/10 pb-12">
                <h3 className="text-white text-xl mb-4">{p.title}</h3>
                <p className="text-lavender/50 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Principles = () => {
  const items = [
    { title: "Primero el diagnóstico, siempre", desc: "No proponemos soluciones sin entender el problema. El diagnóstico inicial es gratuito y sin compromiso." },
    { title: "Hablamos en resultados", desc: "Tenemos el conocimiento técnico, pero con el cliente hablamos de cuánto ahorra, cuánto gana y cuándo recupera su inversión." },
    { title: "Medimos todo", desc: "Lo que no se mide no se mejora. Cada proyecto incluye métricas de seguimiento para garantizar que funciona." },
    { title: "Interdisciplinarios por convicción", desc: "Ingenieros eléctricos, energéticos, civiles y consultores financieros. Cada proyecto abordado en todas sus dimensiones." }
  ];

  return (
    <section className="py-24 bg-off-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-gold-d text-xs font-bold uppercase tracking-widest mb-4">¿Por qué Soléctrica?</div>
        <h2 className="text-navy text-4xl md:text-5xl mb-20">Principios de trabajo, no palabras de catálogo</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {items.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <h3 className="text-navy text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold rounded-full"></span> {item.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Blog = () => {
  const posts = [
    {
      cat: "Incentivos Tributarios",
      title: "¿Qué es la Ley 1715 y cómo puede reducir sus impuestos con energía solar?",
      desc: "Todo lo que necesita saber sobre los beneficios fiscales disponibles para empresas que invierten en FNCE en Colombia."
    },
    {
      cat: "Eficiencia Energética",
      title: "5 señales de que su empresa está pagando de más en energía",
      desc: "Identifique las ineficiencias más comunes y estime cuánto dinero puede estar perdiendo cada mes sin saberlo."
    },
    {
      cat: "Mercado Energético",
      title: "Mercado no regulado en Colombia: ¿qué es y cuándo le conviene?",
      desc: "Una guía práctica para saber si su empresa califica y cuánto podría ahorrar cambiando de modalidad de contratación."
    }
  ];

  return (
    <section id="blog" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <div className="text-gold-d text-xs font-bold uppercase tracking-widest mb-4">Conocimiento</div>
            <h2 className="text-navy text-4xl md:text-5xl">Actualidad energética para su empresa</h2>
          </div>
          <a href="#" className="text-navy hover:text-gold-d font-bold text-sm uppercase tracking-widest flex items-center gap-2 border-b-2 border-navy/10 pb-1">
            Ver todos los artículos <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="bg-off-white aspect-video mb-6 rounded-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-colors"></div>
              </div>
              <div className="text-gold-d text-[10px] font-bold uppercase tracking-widest mb-3">{post.cat}</div>
              <h3 className="text-navy text-xl mb-4 group-hover:text-gold-d transition-colors leading-tight">{post.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{post.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <section id="contacto" className="py-24 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 vertical-lines opacity-10"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <div className="text-gold text-xs font-bold uppercase tracking-widest mb-6">El primer paso es gratis</div>
        <h2 className="text-white text-5xl md:text-7xl mb-4">Pruébenos.</h2>
        <h3 className="text-gold text-3xl md:text-4xl mb-8">Sin costo. Sin compromiso.</h3>
        <p className="text-lavender/60 text-lg font-light mb-16 max-w-2xl mx-auto">
          Diagnosticamos su caso y en menos de 48 horas le decimos dónde está parado y qué puede hacer. Conozca el potencial de ahorro de su empresa.
        </p>

        <div className="bg-white p-8 md:p-12 rounded-sm text-left shadow-2xl">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <label className="text-navy text-xs font-bold uppercase tracking-wider">Nombre completo *</label>
                  <input required type="text" className="w-full bg-off-white border border-navy/10 px-4 py-3 rounded-sm focus:outline-none focus:border-gold transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-navy text-xs font-bold uppercase tracking-wider">Empresa *</label>
                  <input required type="text" className="w-full bg-off-white border border-navy/10 px-4 py-3 rounded-sm focus:outline-none focus:border-gold transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-navy text-xs font-bold uppercase tracking-wider">Cargo</label>
                  <input type="text" className="w-full bg-off-white border border-navy/10 px-4 py-3 rounded-sm focus:outline-none focus:border-gold transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-navy text-xs font-bold uppercase tracking-wider">Correo electrónico *</label>
                  <input required type="email" className="w-full bg-off-white border border-navy/10 px-4 py-3 rounded-sm focus:outline-none focus:border-gold transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-navy text-xs font-bold uppercase tracking-wider">Teléfono / WhatsApp</label>
                  <input type="tel" className="w-full bg-off-white border border-navy/10 px-4 py-3 rounded-sm focus:outline-none focus:border-gold transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-navy text-xs font-bold uppercase tracking-wider">Sector</label>
                  <select className="w-full bg-off-white border border-navy/10 px-4 py-3 rounded-sm focus:outline-none focus:border-gold transition-colors appearance-none">
                    <option>Industrial</option>
                    <option>Comercial</option>
                    <option>Construcción</option>
                    <option>Inversionista</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-navy text-xs font-bold uppercase tracking-wider">Servicio de interés</label>
                  <select className="w-full bg-off-white border border-navy/10 px-4 py-3 rounded-sm focus:outline-none focus:border-gold transition-colors appearance-none">
                    <option>Reducción de costos</option>
                    <option>Infraestructura eléctrica</option>
                    <option>Generación de energía</option>
                    <option>Todos los anteriores</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-navy text-xs font-bold uppercase tracking-wider">Mensaje o descripción</label>
                  <textarea rows={4} className="w-full bg-off-white border border-navy/10 px-4 py-3 rounded-sm focus:outline-none focus:border-gold transition-colors resize-none"></textarea>
                </div>
                <div className="md:col-span-2 pt-4">
                  <button 
                    disabled={isLoading}
                    className="w-full bg-gold hover:bg-gold-d text-navy py-4 rounded-sm font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isLoading ? "Enviando..." : "Solicitar diagnóstico gratuito"}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-navy text-3xl mb-4 font-display">¡Gracias!</h3>
                <p className="text-muted text-lg max-w-md mx-auto">
                  Un asesor de Soléctrica se comunicará con usted en menos de 48 horas hábiles con su diagnóstico energético gratuito.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 text-lavender/40 text-sm">
          ¿Prefiere WhatsApp? <a href="https://wa.me/573008760151" className="text-gold hover:underline">+57 300 876 0151</a>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-footer-bg pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-6">
            <div className="font-display text-2xl font-bold text-white tracking-tighter">
              SOL<span className="text-gold">É</span>CTRICA
            </div>
            <p className="text-lavender/40 text-sm leading-relaxed">
              Transformamos la energía en ventaja competitiva para las empresas colombianas.
            </p>
          </div>
          
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-8">Navegación</h4>
            <ul className="space-y-4 text-lavender/60 text-sm">
              <li><a href="#inicio" className="hover:text-gold transition-colors">Inicio</a></li>
              <li><a href="#nosotros" className="hover:text-gold transition-colors">Sobre Nosotros</a></li>
              <li><a href="#soluciones" className="hover:text-gold transition-colors">Soluciones</a></li>
              <li><a href="#blog" className="hover:text-gold transition-colors">Blog</a></li>
              <li><a href="#contacto" className="hover:text-gold transition-colors">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-8">Soluciones</h4>
            <ul className="space-y-4 text-lavender/60 text-sm">
              <li><a href="#soluciones" className="hover:text-gold transition-colors">Herramienta (Jessy)</a></li>
              <li><a href="#soluciones" className="hover:text-gold transition-colors">Infraestructura Eléctrica</a></li>
              <li><a href="#soluciones" className="hover:text-gold transition-colors">Generación de Energía</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-8">Contacto</h4>
            <ul className="space-y-4 text-lavender/60 text-sm">
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-gold" /> +57 300 876 0151</li>
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-gold" /> gerencia.comercial@solectrica.co</li>
              <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-gold" /> Colombia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-lavender/30 text-xs">
          <div>© Soléctrica S.A.S. 2025 · Todos los derechos reservados</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Política de privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos de servicio</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const WhatsAppWidget = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem('wa-closed')) {
        setIsVisible(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosed(true);
    sessionStorage.setItem('wa-closed', 'true');
  };

  if (isClosed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-7 right-7 z-[100] flex items-center"
        >
          <a 
            href="https://wa.me/573008760151?text=Hola%20Sol%C3%A9ctrica%2C%20quiero%20solicitar%20un%20diagn%C3%B3stico%20gratuito."
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform group"
          >
            <MessageCircle className="w-6 h-6 fill-white" />
            <span className="font-bold text-sm uppercase tracking-wider">Diagnóstico gratuito</span>
          </a>
          <button 
            onClick={handleClose}
            className="absolute -top-2 -right-2 bg-navy text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] border border-white/10 shadow-lg"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-[2px] bg-gold origin-left z-[200]" 
      style={{ scaleX }} 
    />
  );
};

export default function App() {
  return (
    <div className="min-h-screen selection:bg-gold selection:text-navy">
      <ScrollProgress />
      <Navbar />
      
      <main>
        <Hero />
        <Problem />
        <Solutions />
        <WhoFor />
        <Promises />
        <Principles />
        <Blog />
        <Contact />
      </main>

      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
