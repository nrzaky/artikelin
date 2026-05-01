import { Button } from '@/components/ui/button';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from '@/components/ui/card';
import { Github, Linkedin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const About = () => {
  return (
    <>
      <Navbar />
      {/* SEO */}
      <Helmet>
        <title>About - Naufal Raikhan Zaky</title>
        <meta
          name="description"
          content="About the creator of Artikelin, a backend developer passionate about building scalable web applications."
        />
      </Helmet>

      <section id="about" className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          {/* HEADER */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Backend Developer • Web Enthusiast • Problem Solver
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="animate-slide-up">
              <Card className="p-8 shadow-card hover:shadow-glow transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="w-48 h-48 rounded-full overflow-hidden mb-8 shadow-soft">
                    <img
                      src="src/assets/images/profile-placeholder.jpg"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-2xl font-bold mb-2">
                    Naufal Raikhan Zaky
                  </h3>

                  <p className="text-primary font-semibold mb-2">
                    Backend Developer
                  </p>

                  <p className="text-sm text-muted-foreground mb-6">
                    Focus on Backend Development • REST API • Database Design
                  </p>

                  <div className="flex items-center gap-3 flex-wrap justify-center">
                    <a href="https://naufalraikhanzaky.vercel.app" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        Portfolio Website
                      </Button>
                    </a>

                    <a
                      href="https://github.com/nrzaky"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="icon">
                        <Github size={20} />
                      </Button>
                    </a>

                    <a
                      href="https://linkedin.com/in/naufalraikhanz"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="icon">
                        <Linkedin size={20} />
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  About Artikelin
                </h2>

                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong>Artikelin</strong> adalah platform blog teknologi yang
                  membahas pemrograman, software development, dan tren teknologi
                  terbaru. Website ini dibuat untuk berbagi wawasan, tutorial,
                  serta insight dunia coding untuk developer modern.
                </p>

                <p className="text-muted-foreground leading-relaxed mb-4">
                  Mulai dari bahasa pemrograman seperti PHP, TypeScript,
                  hingga backend modern seperti Golang dan cloud development.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  Artikelin dibangun menggunakan teknologi modern seperti
                  React, TypeScript, Supabase, dan dideploy menggunakan
                  Vercel untuk performa cepat dan scalable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
