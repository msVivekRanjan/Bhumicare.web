'use client';
import { Button } from '@/components/ui/button';
import { Check, Cpu, Cloud, BrainCircuit, MicVocal, Linkedin } from 'lucide-react';
import { LandingHeader } from '@/components/landing/header';
import { LandingFooter } from '@/components/landing/footer';
import { AnimatedNumber } from '@/components/landing/animated-number';
import Image from 'next/image';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FeatureShowcase } from '@/components/landing/feature-showcase';
import { SocialProof } from '@/components/landing/social-proof';
import { EndorsementCarousel } from '@/components/landing/endorsement-carousel';
import { useState } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ProductCarousel } from '@/components/landing/product-carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslation } from '@/hooks/use-translation';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id);

const Section = ({ children, className, id, ...props }: { children: React.ReactNode, className?: string, id?: string }) => (
    <motion.section
        id={id}
        className={cn("relative py-24 sm:py-32 px-6", className)}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        {...props}
    >
        <div className="container mx-auto max-w-7xl">
            {children}
        </div>
    </motion.section>
);

const SectionDivider = () => (
    <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
)


const FlipCard = ({ member }: { member: ReturnType<typeof useTeamMembers>[0] }) => {
    const { t } = useTranslation();
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="perspective-1000"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <motion.div
                className="relative w-full h-80"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Front of card */}
                <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center text-center p-4 bg-background-secondary border border-white/10 rounded-2xl">
                     <Image 
                        src={member.avatarUrl} 
                        alt={member.name} 
                        width={100} 
                        height={100} 
                        className="rounded-full mx-auto mb-4 border-2 border-primary"
                    />
                    <h4 className="text-lg font-semibold">{member.name}</h4>
                    <p className="text-sm text-primary/80">{member.role}</p>
                    <p className="text-xs text-muted-foreground mt-4 italic">{t('hover_to_know_more')}</p>
                </div>
                
                {/* Back of card */}
                <div className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)] flex flex-col items-center justify-center text-center p-6 bg-card border border-primary/20 rounded-2xl">
                    <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                        <Linkedin className="w-6 h-6" />
                    </a>
                </div>
            </motion.div>
        </div>
    );
};

const useTeamMembers = () => {
    const { t } = useTranslation();
    return [
        { name: t('team_member_1_name'), avatarUrl: getImage('team-raj')?.imageUrl!, role: t('team_member_1_role'), bio: t('team_member_1_bio'), linkedin: '#' },
        { name: t('team_member_2_name'), avatarUrl: getImage('team-vivek')?.imageUrl!, role: t('team_member_2_role'), bio: t('team_member_2_bio'), linkedin: '#' },
        { name: t('team_member_3_name'), avatarUrl: getImage('team-ayush')?.imageUrl!, role: t('team_member_3_role'), bio: t('team_member_3_bio'), linkedin: '#' },
        { name: t('team_member_4_name'), avatarUrl: getImage('team-subasis')?.imageUrl!, role: t('team_member_4_role'), bio: t('team_member_4_bio'), linkedin: '#' },
    ];
};

const useSdgData = () => {
    const { t } = useTranslation();
    return [
        {
            id: 2,
            imageId: 'sdg-2',
            title: t('sdg_2_title'),
            description: t('sdg_2_desc'),
        },
        {
            id: 6,
            imageId: 'sdg-6',
            title: t('sdg_6_title'),
            description: t('sdg_6_desc'),
        },
        {
            id: 12,
            imageId: 'sdg-12',
            title: t('sdg_12_title'),
            description: t('sdg_12_desc'),
        },
        {
            id: 13,
            imageId: 'sdg-13',
            title: t('sdg_13_title'),
            description: t('sdg_13_desc'),
        },
    ];
}


export default function LandingPage() {
    const { t } = useTranslation();
    const teamMembers = useTeamMembers();
    const sdgData = useSdgData();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const spotlightStyle = useTransform(
        [mouseX, mouseY],
        ([x, y]) => `radial-gradient(circle at ${x}px ${y}px, hsl(var(--secondary) / 0.15), transparent 40%)`
    );

    const handleMouseMove = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const { clientX, clientY, currentTarget } = event;
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };
    
    const dashboardImage = getImage('dashboard-dark');
    const problemImage = getImage('problem-viz');
    const aicSoaLogo = getImage('supporter-aic-soa');
    const ashokaImage = getImage('ashoka-emblem');


    return (
        <div className="bg-background text-foreground font-sans antialiased">
            <LandingHeader />

            <main className="bg-aurora-static">
                {/* Hero Section */}
                <section 
                    id="home" 
                    className="relative h-screen min-h-[700px] flex items-center justify-center text-center px-6 overflow-hidden"
                    onMouseMove={handleMouseMove}
                >
                     <motion.div 
                        className="absolute inset-0 z-0 pointer-events-none"
                        style={{ background: spotlightStyle }}
                    />
                    <div className="absolute inset-0 bg-background/80 z-0" />

                    <motion.div 
                        className="relative z-10 space-y-8 max-w-4xl"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                    >
                         <motion.h1 
                            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter"
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }}}
                        >
                            {t('hero_title')}
                        </motion.h1>
                        <motion.p 
                            className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto"
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }}}
                        >
                            {t('hero_subtitle')}
                        </motion.p>
                        <motion.div 
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }}}
                        >
                            <Button size="lg" asChild className="w-full sm:w-auto">
                                <Link href="/register">{t('get_started_free')}</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                                <Link href="#how-it-works">{t('how_it_works')}</Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                </section>
                
              
                  {/* Social Proof Marquee */}
                  <SocialProof />
                  <SectionDivider />

                  {/* The Problem Section */}
                  <Section id="problem">
                      <div className="grid lg:grid-cols-2 gap-12 items-center">
                          <div className="space-y-4">
                              <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter">{t('problem_title')}</h2>
                              <p className="text-lg text-muted-foreground">
                                  {t('problem_desc')}
                              </p>
                              <ul className="space-y-3 pt-4">
                                  <li className="flex items-center gap-3">
                                      <Check className="h-5 w-5 text-primary" />
                                      <span className="text-muted-foreground">{t('problem_point_1')}</span>
                                  </li>
                                  <li className="flex items-center gap-3">
                                      <Check className="h-5 w-5 text-primary" />
                                      <span className="text-muted-foreground">{t('problem_point_2')}</span>
                                  </li>
                                  <li className="flex items-center gap-3">
                                      <Check className="h-5 w-5 text-primary" />
                                      <span className="text-muted-foreground">{t('problem_point_3')}</span>
                                  </li>
                              </ul>
                          </div>
                          <motion.div 
                              className="relative aspect-video rounded-2xl p-8 flex items-center justify-center bg-background-secondary border border-white/10"
                              whileInView={{ scale: [0.95, 1], opacity: [0.5, 1] }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              viewport={{ once: true }}
                          >
                            {problemImage && <Image 
                                  src={problemImage.imageUrl} 
                                  alt={problemImage.description}
                                  data-ai-hint={problemImage.imageHint}
                                  width={800} height={600} 
                                  className="rounded-lg shadow-2xl shadow-primary/10 opacity-70"
                            />}
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                          </motion.div>
                      </div>
                  </Section>
                  <SectionDivider />
                  
                  {/* The Solution Section */}
                  <FeatureShowcase />
                  <SectionDivider />

                  {/* Dashboard Preview Section */}
                  <Section id="dashboard-preview">
                      <div className="text-center max-w-4xl mx-auto space-y-6">
                          <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter">{t('dashboard_preview_title')}</h2>
                          <p className="text-lg text-muted-foreground">
                              {t('dashboard_preview_desc')}
                          </p>
                      </div>
                      <motion.div 
                          className="relative mt-16"
                          initial={{ y: 50, opacity: 0}}
                          whileInView={{ y: 0, opacity: 1 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                      >
                          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-primary/20 to-purple-600/20 opacity-20 blur-2xl" />
                          {dashboardImage && <Image 
                              src={dashboardImage.imageUrl}
                              alt={dashboardImage.description}
                              data-ai-hint={dashboardImage.imageHint}
                              width={1200}
                              height={800}
                              className="relative rounded-xl border border-white/10 shadow-2xl shadow-primary/10"
                          />}
                          {/* Animated elements to make it feel alive */}
                          <motion.div
                              className="absolute"
                              style={{ top: '45%', left: '35%', width: '20%', height: '2px' }}
                              animate={{
                                  background: [
                                      'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
                                      'linear-gradient(90deg, transparent, hsl(var(--secondary)), transparent)',
                                      'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
                                  ],
                              }}
                              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          />
                          <motion.div
                              className="absolute rounded-full bg-primary/50"
                              style={{ top: '65%', right: '28%', width: '12px', height: '12px' }}
                              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          />
                      </motion.div>
                  </Section>
                  <SectionDivider />

                  {/* How It Works Section */}
                  <Section id="how-it-works">
                      <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
                          <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter">{t('how_it_works_title')}</h2>
                          <p className="text-lg text-muted-foreground">{t('how_it_works_subtitle')}</p>
                      </div>
                      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                          <div className="absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2 hidden lg:block" />
                          {
                              [
                                  { icon: Cpu, title: `1. ${t('how_it_works_step_1_title')}`, description: t('how_it_works_step_1_desc') },
                                  { icon: Cloud, title: `2. ${t('how_it_works_step_2_title')}`, description: t('how_it_works_step_2_desc') },
                                  { icon: BrainCircuit, title: `3. ${t('how_it_works_step_3_title')}`, description: t('how_it_works_step_3_desc') },
                                  { icon: MicVocal, title: `4. ${t('how_it_works_step_4_title')}`, description: t('how_it_works_step_4_desc') },
                              ].map((step, index) => (
                                  <motion.div 
                                      key={index}
                                      className="relative text-center p-6 bg-background-secondary border border-white/10 rounded-2xl"
                                      whileHover={{ y: -8, boxShadow: "0 10px 20px hsla(var(--primary) / 0.1)" }}
                                  >
                                      <div className="flex items-center justify-center mb-4">
                                          <div className="bg-background p-4 rounded-full border border-white/10">
                                              <step.icon className="w-8 h-8 text-primary" />
                                          </div>
                                      </div>
                                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                      <p className="text-muted-foreground text-sm">{step.description}</p>
                                  </motion.div>
                              ))
                          }
                      </div>
                  </Section>
                  <SectionDivider />

                  {/* The Impact Section */}
                  <Section id="impact">
                      <div className="grid lg:grid-cols-2 gap-16 items-center">
                          <div className="space-y-6">
                              <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter">{t('impact_title')}</h2>
                              <p className="text-lg text-muted-foreground">{t('impact_desc')}</p>
                              {/* Core Metrics */}
                              <div className="flex flex-col sm:flex-row gap-8 pt-4">
                                  <div className="text-left">
                                      <AnimatedNumber value={30} className="text-5xl font-bold text-primary" prefix="+" />
                                      <p className="text-muted-foreground mt-1">{t('impact_metric_1')}</p>
                                  </div>
                                  <div className="text-left">
                                      <AnimatedNumber value={30} className="text-5xl font-bold text-primary" prefix="-" />
                                      <p className="text-muted-foreground mt-1">{t('impact_metric_2')}</p>
                                  </div>
                                  <div className="text-left">
                                      <AnimatedNumber value={40} className="text-5xl font-bold text-primary" prefix="-" />
                                      <p className="text-muted-foreground mt-1">{t('impact_metric_3')}</p>
                                  </div>
                              </div>
                          </div>
                          {/* Credibility Column */}
                          <div className="space-y-8 p-8 bg-background-secondary border border-white/10 rounded-2xl">
                            <div className="flex items-start gap-4">
                                  <div className="p-3 bg-background rounded-lg border border-white/10"><Cpu className="h-6 w-6 text-secondary" /></div>
                                  <div>
                                      <h4 className="font-semibold">{t('impact_validated_tech_title')}</h4>
                                      <p className="text-muted-foreground text-sm">{t('impact_validated_tech_desc')}</p>
                                  </div>
                            </div>
                              <div className="flex items-start gap-4">
                                  {ashokaImage && <div className="p-3 bg-background rounded-lg border border-white/10"><Image src={ashokaImage.imageUrl} alt={ashokaImage.description} width={24} height={24} className="filter-white"/></div>}
                                  <div>
                                      <h4 className="font-semibold">{t('impact_alignment_title')}</h4>
                                      <p className="text-muted-foreground text-sm">{t('impact_alignment_desc')}</p>
                                  </div>
                            </div>
                              <div className="flex items-start gap-4">
                                  <div className="p-3 bg-background rounded-lg border border-white/10"><Check className="h-6 w-6 text-primary" /></div>
                                  <div>
                                      <h4 className="font-semibold">{t('impact_sdg_title')} <span className="text-xs font-normal text-muted-foreground">{t('click_icons_to_know_more')}</span></h4>
                                      <div className="flex items-center gap-3 mt-2">
                                          {sdgData.map(sdg => {
                                            const sdgImage = getImage(sdg.imageId);
                                            return sdgImage ? (
                                              <Dialog key={sdg.id}>
                                                  <DialogTrigger asChild>
                                                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                          <Image src={sdgImage.imageUrl} alt={`SDG ${sdg.id}`} width={32} height={32} className="cursor-pointer" />
                                                      </motion.button>
                                                  </DialogTrigger>
                                                  <DialogContent className="sm:max-w-md bg-background/80 backdrop-blur-xl border-primary/20">
                                                      <DialogHeader>
                                                          <div className="flex justify-center mb-4">
                                                            <Image src={sdgImage.imageUrl} alt={sdg.title} width={64} height={64} />
                                                          </div>
                                                          <DialogTitle className="text-center font-headline text-2xl">{sdg.title}</DialogTitle>
                                                      </DialogHeader>
                                                      <p className="text-muted-foreground text-center px-4 pb-4">
                                                         {sdg.description}
                                                      </p>
                                                  </DialogContent>
                                              </Dialog>
                                            ) : null;
                                          })}
                                      </div>
                                  </div>
                            </div>
                          </div>
                      </div>
                  </Section>
                  <SectionDivider />
                   
                   {/* Product Testing Gallery */}
                    <Section id="product-gallery">
                        <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
                            <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter">{t('product_gallery_title')}</h2>
                            <p className="text-lg text-muted-foreground">{t('product_gallery_subtitle')}</p>
                        </div>
                        <ProductCarousel />
                        <div className="text-center mt-8 max-w-2xl mx-auto">
                            <p className="text-sm text-muted-foreground">
                                {t('product_gallery_footer')}
                            </p>
                        </div>
                    </Section>
                    <SectionDivider />

                  {/* Testimonials Section */}
                  <Section id="testimonials">
                      <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
                          <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter">{t('testimonials_title')}</h2>
                      </div>
                      <EndorsementCarousel />
                  </Section>
                  <SectionDivider />

                  {/* Team & Supporters Section */}
                  <Section id="team">
                      <div className="text-center max-w-4xl mx-auto space-y-6 mb-16">
                          <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter">{t('team_title')}</h2>
                          <p className="text-lg text-muted-foreground">{t('team_subtitle')}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                          {teamMembers.map((member, i) => (
                              <motion.div 
                                  key={member.name}
                                  initial={{ opacity: 0, y: 30 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.5, delay: i * 0.1 }}
                              >
                                  <FlipCard member={member} />
                              </motion.div>
                          ))}
                      </div>
                      <div className="text-center mt-24">
                          <p className="text-lg text-muted-foreground">{t('team_supported_by')}</p>
                          <div className="mt-6 flex justify-center items-center">
                            {aicSoaLogo && <Image src={aicSoaLogo.imageUrl} alt={aicSoaLogo.description} data-ai-hint={aicSoaLogo.imageHint} width={200} height={80} className="filter-grayscale contrast-0 brightness-200" />}
                          </div>
                      </div>
                  </Section>

                  {/* Final CTA Section */}
                  <section className="py-24 sm:py-32">
                      <div className="container mx-auto max-w-4xl px-6 text-center">
                          <motion.div 
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="relative p-12 bg-background-secondary border border-white/10 rounded-2xl overflow-hidden"
                          >
                              <div className="absolute inset-0 bg-aurora-cta z-[-1]" />
                              <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter">{t('cta_title')}</h2>
                              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4 mb-8">
                                  {t('cta_subtitle')}
                              </p>
                              <Button size="lg" asChild>
                                  <Link href="/register">{t('get_started_for_free')}</Link>
                              </Button>
                          </motion.div>
                      </div>
                  </section>
                
            </main>
            
            <LandingFooter />
        </div>
    );
}
