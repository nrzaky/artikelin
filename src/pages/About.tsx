import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Github, Linkedin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import profilePlaceholder from '@/assets/images/profile-placeholder.jpg';

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
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Backend Developer • Web Enthusiast • Problem Solver
            </p>
          </div>

          <div className="grid gap-16 lg:grid-cols-2 items-start">
            <Card className="p-8 shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up">
              <div className="flex flex-col items-center text-center">
                <div className="w-48 h-48 rounded-full overflow-hidden mb-8 shadow-soft">
                  <img
                    src={profilePlaceholder}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-2xl font-bold mb-2">Naufal Raikhan Zaky</h3>
                <p className="text-primary font-semibold mb-2">Backend Developer</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Focus on Backend Development • REST API • Database Design
                </p>

                <div className="flex flex-wrap justify-center gap-3">
                  <a href="https://naufalraikhanzaky.vercel.app" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      Portfolio Website
                    </Button>
                  </a>
                  <a href="https://github.com/nrzaky" target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon">
                      <Github size={20} />
                    </Button>
                  </a>
                  <a href="https://linkedin.com/in/naufalraikhanz" target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon">
                      <Linkedin size={20} />
                    </Button>
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-glow transition-all duration-300">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">About the Creator</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Hello, I'm <strong>Naufal Raikhan Zaky</strong>, a software developer focused on backend development and modern web technologies.
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    I built this website as a place to share knowledge and as a portfolio project to showcase my skills in building modern web applications.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://github.com/nrzaky"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        GitHub
                      </Button>
                    </a>
                    <a
                      href="https://linkedin.com/in/naufalraikhanz"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        LinkedIn
                      </Button>
                    </a>
                    <a
                      href="https://naufalraikhanzaky.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        My Portfolio
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="about-artikelin" className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 lg:grid-cols-2 items-start">
            <Card className="p-8 shadow-card hover:shadow-glow transition-all duration-300">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">About Artikelin</h2>
                  <p className="text-muted-foreground leading-relaxed max-w-3xl">
                    <strong>Artikelin</strong> is a technology blog platform covering programming, software development, and the latest technology trends. This website is created to share insights, tutorials, and coding knowledge for modern developers.
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    From programming languages like PHP and TypeScript to modern backend topics such as Golang and cloud development.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Artikelin is built with modern technologies like React, TypeScript, Supabase, and deployed on Vercel for fast, scalable performance.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-glow transition-all duration-300">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">What Artikelin Offers</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Artikelin is designed as a polished learning and reference hub for developers who want clear insights, practical guides, and up-to-date technology trends.
                  </p>
                </div>
                <ul className="space-y-4 text-muted-foreground list-disc list-inside">
                  <li>Insight dan tutorial praktis untuk developer modern.</li>
                  <li>Artikel berkualitas tentang backend, API, dan cloud.</li>
                  <li>Referensi teknologi terbaru dan praktik terbaik.</li>
                  <li>Modern web stack guidance dengan fokus pada kualitas.</li>
                </ul>
              </div>
            </Card>
          </div>

          <div className="mt-10">
            <Card className="p-8 shadow-card hover:shadow-glow transition-all duration-300">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">Tech Stack Explanation</h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Artikelin uses a modern stack so this CMS is responsive, easy to develop, and production-ready. The frontend is built with React, TypeScript, Vite, TailwindCSS, and Shadcn UI, while navigation is handled by React Router.
                  </p>
                  <p>
                    The backend uses Supabase as a Backend-as-a-Service to provide PostgreSQL database, optional authentication, storage for image uploads, and a ready-to-use REST API.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-semibold">1. Role of each technology</h4>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>React</strong>: builds a dynamic, interactive UI using reusable components.</li>
                    <li><strong>TypeScript</strong>: adds static typing for safer code, better tooling, and stronger maintainability.</li>
                    <li><strong>Vite</strong>: a fast build tool with instant hot module replacement for faster development.
                  </li>
                    <li><strong>TailwindCSS</strong>: utility-first styling for consistent design without heavy custom CSS.</li>
                    <li><strong>Shadcn UI</strong>: provides customizable, ready-made UI components for a modern look.</li>
                    <li><strong>React Router</strong>: manages client-side page navigation for a fast, seamless experience.</li>
                    <li><strong>Supabase</strong>: delivers a full backend with PostgreSQL, authentication, storage, and REST API from one platform.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-semibold">2. Why this stack is suitable for a modern CMS</h4>
                  <p className="text-muted-foreground">
                    This stack is fast, modular, and easy to grow. React + TypeScript gives strong app structure, TailwindCSS helps keep design consistent, and Supabase allows the team to focus on features instead of managing a traditional backend.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-semibold">3. Advantages of Supabase compared to a traditional backend</h4>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Backend implementation is much faster because features like database, auth, storage, and API are already available.</li>
                    <li>Less infrastructure management means the focus can stay on application features.</li>
                    <li>PostgreSQL integration enables full-text search, many-to-many relationships, and powerful queries.</li>
                    <li>Built-in storage makes image upload and management easy without a separate server.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-semibold">4. How the frontend and backend interact</h4>
                  <p className="text-muted-foreground">
                    The React frontend calls Supabase REST API to fetch and store article, category, and user data. Data is displayed directly in the UI while Supabase handles image storage, authentication, and database queries.
                  </p>
                  <p className="text-muted-foreground">
                    Features like article management CRUD, many-to-many categories, full-text search, and SEO run smoothly thanks to this frontend-backend architecture.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
