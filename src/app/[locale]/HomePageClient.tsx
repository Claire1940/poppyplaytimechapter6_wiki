'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  ExternalLink,
  Film,
  FlaskConical,
  KeyRound,
  Map,
  Play,
  Skull,
  Sparkles,
  Target,
  Tv,
  Users,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useMessages } from 'next-intl'
import { VideoFeature } from '@/components/home/VideoFeature'
import { LatestGuidesAccordion } from '@/components/home/LatestGuidesAccordion'
import { NativeBannerAd, AdBanner } from '@/components/ads'
import { SidebarAd } from '@/components/ads/SidebarAd'
import { scrollToSection } from '@/lib/scrollToSection'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { ContentItemWithType } from '@/lib/getLatestArticles'
import type { ModuleLinkMap } from '@/lib/buildModuleLinkMap'

// Lazy load heavy components
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// Loading placeholder
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
)

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined
  children: React.ReactNode
  className?: string
  locale: string
}) {
  if (linkData) {
    const href = locale === 'en' ? linkData.url : `/${locale}${linkData.url}`
    return (
      <Link
        href={href}
        className={`${className || ''} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    )
  }
  return <>{children}</>
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[]
  moduleLinkMap: ModuleLinkMap
  locale: string
}

export default function HomePageClient({ latestArticles, moduleLinkMap, locale }: HomePageClientProps) {
  const t = useMessages() as any
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://poppyplaytimechapter6.wiki'

  // Structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: "Poppy Playtime Chapter 6",
        description: "Track Poppy Playtime Chapter 6 release news, trailer clues, story theories, Prototype updates, and Chapter 5 ending fallout.",
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Poppy Playtime Chapter 6 - Horror Puzzle Sequel Tracker",
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: "Poppy Playtime Chapter 6",
        alternateName: "Poppy Playtime Ch6",
        url: siteUrl,
        description: "Tracker for Poppy Playtime Chapter 6 release news, trailer breakdowns, lore theories, and Prototype updates",
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Poppy Playtime Chapter 6 - Horror Puzzle Sequel Tracker",
        },
        sameAs: [
          'https://store.steampowered.com/app/1721470/Poppy_Playtime/',
          'https://discord.com/invite/FmsXQDK7Zp',
          'https://www.reddit.com/r/PoppyPlaytime/',
          'https://x.com/mobgamesstudios',
          'https://www.youtube.com/channel/UCXqV4yoyC_mmZye6VbKFPeQ',
        ],
      },
      {
        '@type': 'VideoGame',
        name: "Poppy Playtime",
        gamePlatform: ['PC', 'Steam'],
        applicationCategory: 'Game',
        genre: ['Horror', 'Puzzle', 'Adventure'],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: 'https://store.steampowered.com/app/1721470/Poppy_Playtime/',
        },
      },
    ],
  }

  // Accordion states for story theories, ending setup, prototype, and harley sawyer modules
  const [storiesExpanded, setStoriesExpanded] = useState<number | null>(null)
  const [endingExpanded, setEndingExpanded] = useState<number | null>(null)
  const [prototypeExpanded, setPrototypeExpanded] = useState<number | null>(null)
  const [harleyExpanded, setHarleyExpanded] = useState<number | null>(null)
  // Accordion states for modules 9-12
  const [walkthroughExpanded, setWalkthroughExpanded] = useState<number | null>(null)
  const [codesExpanded, setCodesExpanded] = useState<number | null>(null)

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 左侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
      </aside>

      {/* 右侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
      </aside>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => scrollToSection('release-date')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-lg transition-colors"
              >
                <Calendar className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.mobentertainment.com/poppy-playtime"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* 广告位 2: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Video Section */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId="EriEensiy0I"
              title="Poppy Playtime: Chapter 5 - Official Game Trailer"
              posterImage="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={30} />

      {/* 广告位 3: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Tools Grid - 4 Navigation Cards */}
      <section className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title}{' '}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionIds = [
                'release-date', 'trailer', 'story-theories', 'ending-setup',
                'characters', 'villains', 'prototype', 'harley-sawyer',
                'chapter-5-walkthrough', 'puzzle-codes', 'pressure-hand', 'tape-locations'
              ]
              const sectionId = sectionIds[index]

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group p-6 rounded-xl border border-border
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg mb-4
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors">
                    <DynamicIcon
                      name={card.icon}
                      className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* 广告位 4: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 1: Release Date */}
      <section id="release-date" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Calendar className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.poppyReleaseDate.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['poppyReleaseDate']} locale={locale}>
                {t.modules.poppyReleaseDate.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.poppyReleaseDate.subtitle}
            </p>
          </div>

          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-8 scroll-reveal">
            {t.modules.poppyReleaseDate.intro}
          </p>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.poppyReleaseDate.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <span className="inline-block text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-3 text-[hsl(var(--nav-theme-light))] font-medium">
                  {item.label}
                </span>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 2: Trailer */}
      <section id="trailer" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Play className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.poppyTrailer.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['poppyTrailer']} locale={locale}>
                {t.modules.poppyTrailer.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.poppyTrailer.subtitle}
            </p>
          </div>

          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-8 scroll-reveal">
            {t.modules.poppyTrailer.intro}
          </p>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.poppyTrailer.items.map((item: any, index: number) => (
              <a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors block"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] font-medium">
                    {item.label}
                  </span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-[hsl(var(--nav-theme-light))] transition-colors" />
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-[hsl(var(--nav-theme-light))] transition-colors">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.body}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 3: Story Theories */}
      <section id="story-theories" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <BookOpen className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.poppyStoryTheories.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['poppyStoryTheories']} locale={locale}>
                {t.modules.poppyStoryTheories.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.poppyStoryTheories.subtitle}
            </p>
          </div>

          <div className="scroll-reveal space-y-3">
            {t.modules.poppyStoryTheories.items.map((item: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setStoriesExpanded(storiesExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold pr-4">{item.title}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform text-[hsl(var(--nav-theme-light))] ${storiesExpanded === index ? 'rotate-180' : ''}`} />
                </button>
                {storiesExpanded === index && (
                  <div className="px-5 pb-5">
                    <p className="text-muted-foreground text-sm mb-4">{item.summary}</p>
                    <ul className="space-y-2">
                      {item.points.map((point: string, pi: number) => (
                        <li key={pi} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Ending Setup */}
      <section id="ending-setup" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Film className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.poppyEndingSetup.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['poppyEndingSetup']} locale={locale}>
                {t.modules.poppyEndingSetup.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.poppyEndingSetup.subtitle}
            </p>
          </div>

          <div className="scroll-reveal space-y-3">
            {t.modules.poppyEndingSetup.items.map((item: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setEndingExpanded(endingExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold pr-4">{item.title}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform text-[hsl(var(--nav-theme-light))] ${endingExpanded === index ? 'rotate-180' : ''}`} />
                </button>
                {endingExpanded === index && (
                  <div className="px-5 pb-5">
                    <p className="text-muted-foreground text-sm mb-4">{item.summary}</p>
                    <ul className="space-y-2">
                      {item.points.map((point: string, pi: number) => (
                        <li key={pi} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 5: Characters */}
      <section id="characters" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Users className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.poppyCharacters.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['poppyCharacters']} locale={locale}>
                {t.modules.poppyCharacters.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.poppyCharacters.subtitle}
            </p>
          </div>

          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-8 scroll-reveal">
            {t.modules.poppyCharacters.intro}
          </p>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.poppyCharacters.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col gap-3">
                <span className="inline-block self-start text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] font-medium">
                  {item.role}
                </span>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-muted-foreground text-sm flex-1">{item.summary}</p>
                <ul className="space-y-1.5 mt-1">
                  {item.details.map((detail: string, di: number) => (
                    <li key={di} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 6: Villains */}
      <section id="villains" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Skull className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.poppyVillains.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['poppyVillains']} locale={locale}>
                {t.modules.poppyVillains.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.poppyVillains.subtitle}
            </p>
          </div>

          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-8 scroll-reveal">
            {t.modules.poppyVillains.intro}
          </p>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.modules.poppyVillains.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col gap-3">
                <span className="inline-block self-start text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))] font-medium">
                  {item.threat_type}
                </span>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-muted-foreground text-sm flex-1">{item.summary}</p>
                <ul className="space-y-1.5 mt-1">
                  {item.details.map((detail: string, di: number) => (
                    <li key={di} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位: 标准横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 7: The Prototype */}
      <section id="prototype" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Target className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.poppyPrototype.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['poppyPrototype']} locale={locale}>
                {t.modules.poppyPrototype.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.poppyPrototype.subtitle}
            </p>
          </div>

          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-8 scroll-reveal">
            {t.modules.poppyPrototype.intro}
          </p>

          <div className="scroll-reveal space-y-3">
            {t.modules.poppyPrototype.items.map((item: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setPrototypeExpanded(prototypeExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold pr-4">{item.title}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform text-[hsl(var(--nav-theme-light))] ${prototypeExpanded === index ? 'rotate-180' : ''}`} />
                </button>
                {prototypeExpanded === index && (
                  <div className="px-5 pb-5">
                    <p className="text-muted-foreground text-sm">{item.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Harley Sawyer */}
      <section id="harley-sawyer" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <FlaskConical className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.poppyHarleySawyer.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['poppyHarleySawyer']} locale={locale}>
                {t.modules.poppyHarleySawyer.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.poppyHarleySawyer.subtitle}
            </p>
          </div>

          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-8 scroll-reveal">
            {t.modules.poppyHarleySawyer.intro}
          </p>

          <div className="scroll-reveal space-y-3">
            {t.modules.poppyHarleySawyer.items.map((item: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setHarleyExpanded(harleyExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold pr-4">{item.title}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform text-[hsl(var(--nav-theme-light))] ${harleyExpanded === index ? 'rotate-180' : ''}`} />
                </button>
                {harleyExpanded === index && (
                  <div className="px-5 pb-5">
                    <p className="text-muted-foreground text-sm">{item.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Module 9: Chapter 5 Walkthrough */}
      <section id="chapter-5-walkthrough" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Map className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.poppyWalkthrough.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['poppyWalkthrough']} locale={locale}>
                {t.modules.poppyWalkthrough.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.poppyWalkthrough.subtitle}
            </p>
          </div>

          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 scroll-reveal">
            {t.modules.poppyWalkthrough.intro}
          </p>

          <div className="scroll-reveal space-y-4">
            {t.modules.poppyWalkthrough.items.map((item: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setWalkthroughExpanded(walkthroughExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center justify-center text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                      {item.step}
                    </span>
                    <div className="text-left">
                      <div className="font-semibold">{item.section}</div>
                      <div className="text-sm text-muted-foreground">{item.objective}</div>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform text-[hsl(var(--nav-theme-light))] ${walkthroughExpanded === index ? 'rotate-180' : ''}`} />
                </button>
                {walkthroughExpanded === index && (
                  <div className="px-5 pb-5 space-y-3">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-sm font-medium mb-1 text-[hsl(var(--nav-theme-light))]">What to do</p>
                      <p className="text-sm text-muted-foreground">{item.what_to_do}</p>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)] rounded-lg">
                      <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{item.result}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 10: Puzzle Codes */}
      <section id="puzzle-codes" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <KeyRound className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.poppyPuzzleCodes.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['poppyPuzzleCodes']} locale={locale}>
                {t.modules.poppyPuzzleCodes.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.poppyPuzzleCodes.subtitle}
            </p>
          </div>

          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 scroll-reveal">
            {t.modules.poppyPuzzleCodes.intro}
          </p>

          <div className="scroll-reveal space-y-3">
            {t.modules.poppyPuzzleCodes.items.map((item: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setCodesExpanded(codesExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4 pr-4 min-w-0">
                    <div className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)]">
                      <span className="text-sm font-mono font-bold text-[hsl(var(--nav-theme-light))] whitespace-nowrap">{item.code}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{item.label}</div>
                      <div className="text-xs text-muted-foreground truncate">{item.use}</div>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform text-[hsl(var(--nav-theme-light))] ${codesExpanded === index ? 'rotate-180' : ''}`} />
                </button>
                {codesExpanded === index && (
                  <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs font-medium text-[hsl(var(--nav-theme-light))] mb-1">Location</p>
                      <p className="text-sm text-muted-foreground">{item.location}</p>
                    </div>
                    <div className="p-3 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)] rounded-lg">
                      <p className="text-xs font-medium text-[hsl(var(--nav-theme-light))] mb-1">Hint</p>
                      <p className="text-sm text-muted-foreground">{item.hint}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 11: Pressure Hand Guide */}
      <section id="pressure-hand" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Zap className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.poppyPressureHand.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['poppyPressureHand']} locale={locale}>
                {t.modules.poppyPressureHand.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.poppyPressureHand.subtitle}
            </p>
          </div>

          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 scroll-reveal">
            {t.modules.poppyPressureHand.intro}
          </p>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.poppyPressureHand.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center justify-center text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                    {item.step}
                  </span>
                  <h3 className="font-bold">{item.heading}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.action}</p>
                <div className="flex items-start gap-2 pt-2 border-t border-border/50">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">{item.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 12: Tape Locations */}
      <section id="tape-locations" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Tv className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.poppyTapeLocations.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['poppyTapeLocations']} locale={locale}>
                {t.modules.poppyTapeLocations.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.poppyTapeLocations.subtitle}
            </p>
          </div>

          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 scroll-reveal">
            {t.modules.poppyTapeLocations.intro}
          </p>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.poppyTapeLocations.items.map((item: any, index: number) => (
              <div key={index} className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold">{item.name}</h3>
                  <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
                    item.type === 'VHS'
                      ? 'bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]'
                      : 'bg-white/10 border border-border text-muted-foreground'
                  }`}>
                    {item.type}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-medium">{item.chapter_area}</span>
                <p className="text-sm text-muted-foreground">{item.location}</p>
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div>
                    <span className="text-xs font-medium text-[hsl(var(--nav-theme-light))]">Route: </span>
                    <span className="text-xs text-muted-foreground">{item.unlock_or_route}</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-[hsl(var(--nav-theme-light))]">Playback: </span>
                    <span className="text-xs text-muted-foreground">{item.playback}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{item.missable_tip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

            {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/FmsXQDK7Zp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/mobgamesstudios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/PoppyPlaytime/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/1721470/Poppy_Playtime/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
