'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  projectTypes,
  features,
  timelines,
  revisionOptions,
  hostingTiers,
  calculatePrice,
} from '@/lib/pricing';

const pageSuggestions = [
  'Homepage',
  'About Us',
  'Services',
  'Contact',
  'Gallery',
  'Blog',
  'FAQ',
  'Testimonials',
  'Our Team',
  'Pricing',
  'Portfolio',
  'News',
  'Events',
  'Partners',
  'Privacy & Terms',
];

const projectTypeIcons: Record<string, JSX.Element> = {
  restaurant: (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016 2.993 2.993 0 002.25-1.016 3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
    </svg>
  ),
  portfolio: (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  business: (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
    </svg>
  ),
  ecommerce: (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  nonprofit: (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
};

export default function PricingCalculator() {
  const [clientName, setClientName] = useState('');
  const [projectType, setProjectType] = useState('restaurant');
  const [pages, setPages] = useState(5);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    features.filter(f => f.default).map(f => f.id)
  );
  const [timeline, setTimeline] = useState('normal');
  const [revisions, setRevisions] = useState('2');
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => calculatePrice({ projectType, pages, selectedFeatures, timeline, revisions }),
    [projectType, pages, selectedFeatures, timeline, revisions]
  );

  const toggleFeature = useCallback((id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  }, []);

  const handleExportPDF = useCallback(async () => {
    const { generateQuotePDF } = await import('@/lib/pdf');
    const doc = generateQuotePDF({
      ...result,
      clientName: clientName || 'Client',
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    });
    doc.save(`WesleyConsults_Quote_${clientName.replace(/\s+/g, '_') || 'Client'}.pdf`);
  }, [result, clientName]);

  const handleWhatsApp = useCallback(() => {
    const name = clientName || 'Client';
    const featuresList = result.selectedFeatureDetails.map(f => f.label).join(', ');
    const text = encodeURIComponent(
      `*WesleyConsults — Project Quotation*\n\n` +
      `Client: ${name}\n` +
      `Project: ${result.projectLabel} website (${result.pages} pages)\n` +
      `Tier: ${result.tier}\n` +
      `Features: ${featuresList || 'Base package'}\n` +
      `Timeline: ${result.timelineLabel}\n\n` +
      `*Price Range: GHS ${result.minPrice.toLocaleString()} – ${result.maxPrice.toLocaleString()}*\n\n` +
      `Payment: 30% deposit (GHS ${result.deposit.toLocaleString()}) to start, balance on delivery.\n\n` +
      `Hosting & domain: GHS ${result.hostingMin}–${result.hostingMax}/year (separate)\n\n` +
      `— WesleyConsults\n` +
      `Tel: 0500610780 | Email: wesleyconsults@gmail.com`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }, [result, clientName]);

  const handleCopy = useCallback(() => {
    const name = clientName || 'Client';
    const featuresList = result.selectedFeatureDetails.map(f => `• ${f.label}: GHS ${f.cost.toLocaleString()}`).join('\n');
    const text =
      `WESLEYCONSULTS — PROJECT QUOTATION\n` +
      `${'═'.repeat(40)}\n\n` +
      `Client: ${name}\n` +
      `Date: ${new Date().toLocaleDateString('en-GB')}\n` +
      `Project: ${result.projectLabel} website\n` +
      `Pages: ${result.pages}\n` +
      `Tier: ${result.tier}\n` +
      `Timeline: ${result.timelineLabel}\n` +
      `Revisions: ${result.revisionLabel}\n\n` +
      `BREAKDOWN\n${'-'.repeat(30)}\n` +
      `Base: GHS ${result.baseRate.toLocaleString()}\n` +
      (result.pageCost > 0 ? `Extra pages: GHS ${result.pageCost.toLocaleString()}\n` : '') +
      (featuresList ? `${featuresList}\n` : '') +
      (result.revisionCost > 0 ? `Revision rounds: GHS ${result.revisionCost.toLocaleString()}\n` : '') +
      (result.rushCost > 0 ? `Rush fee: GHS ${result.rushCost.toLocaleString()}\n` : '') +
      `\nPRICE RANGE: GHS ${result.minPrice.toLocaleString()} – ${result.maxPrice.toLocaleString()}\n\n` +
      `PAYMENT\n` +
      `30% deposit: GHS ${result.deposit.toLocaleString()}\n` +
      `70% balance: GHS ${result.balance.toLocaleString()}\n\n` +
      `HOSTING: GHS ${result.hostingMin}–${result.hostingMax}/year (separate)`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result, clientName]);

  const categories = [
    { key: 'core' as const, label: 'Core' },
    { key: 'functionality' as const, label: 'Features & functionality' },
    { key: 'content' as const, label: 'Content & branding' },
    { key: 'extras' as const, label: 'Extras' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-navy-500 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-xl sm:text-2xl tracking-wide"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                WesleyConsults
              </h1>
              <p className="text-[11px] sm:text-xs text-navy-200 mt-0.5 tracking-widest uppercase">
                Pricing Calculator
              </p>
            </div>
            <img
              src="/wesleylogo.png"
              alt="WesleyConsults logo"
              className="w-24 h-24 sm:w-[6.825rem] sm:h-[6.825rem] object-contain"
            />
          </div>
        </div>
        <div className="h-1 bg-gold-500" />
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left column — inputs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Client name */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200/60">
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
                Client name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="e.g. Calenders Restaurant"
                className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/10 outline-none transition text-base"
              />
            </div>

            {/* Project type */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200/60">
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">
                Project type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {projectTypes.map(pt => (
                  <button
                    key={pt.id}
                    onClick={() => setProjectType(pt.id)}
                    className={`px-3 py-3 rounded-lg border text-sm font-medium transition-all text-left ${
                      projectType === pt.id
                        ? 'border-navy-500 bg-navy-500 text-white shadow-md'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span className="mr-1.5 flex-shrink-0 opacity-70">{projectTypeIcons[pt.id]}</span>
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pages */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200/60">
              <div className="flex justify-between items-baseline mb-3">
                <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Number of pages
                </label>
                <span className="text-2xl font-semibold text-navy-500">{pages}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPages(p => Math.max(1, p - 1))}
                  className="w-7 h-7 flex-shrink-0 rounded-md border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 hover:border-stone-300 flex items-center justify-center font-medium text-base transition-colors"
                >
                  −
                </button>
                <input
                  type="range"
                  min={1}
                  max={15}
                  step={1}
                  value={pages}
                  onChange={e => setPages(parseInt(e.target.value))}
                  className="w-full"
                />
                <button
                  onClick={() => setPages(p => Math.min(15, p + 1))}
                  className="w-7 h-7 flex-shrink-0 rounded-md border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 hover:border-stone-300 flex items-center justify-center font-medium text-base transition-colors"
                >
                  +
                </button>
              </div>
              <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                <span>1 page</span>
                <span className="text-gold-600 font-medium">+GHS 250 per page beyond 5</span>
                <span>15 pages</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {pageSuggestions.slice(0, pages).map((name, i) => (
                  <span
                    key={name}
                    className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all ${
                      i === 0
                        ? 'bg-navy-500 text-white'
                        : i < 5
                        ? 'bg-stone-100 text-stone-600 border border-stone-200'
                        : 'bg-gold-50 text-gold-700 border border-gold-200/60'
                    }`}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Features checklist */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200/60">
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-4">
                Scope checklist
              </label>
              {categories.map(cat => (
                <div key={cat.key} className="mb-4 last:mb-0">
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-2 pl-1">
                    {cat.label}
                  </p>
                  <div className="space-y-1">
                    {features
                      .filter(f => f.category === cat.key)
                      .map(f => (
                        <label
                          key={f.id}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                            selectedFeatures.includes(f.id)
                              ? 'bg-navy-500/[0.04]'
                              : 'hover:bg-stone-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedFeatures.includes(f.id)}
                            onChange={() => toggleFeature(f.id)}
                            disabled={f.default}
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-stone-800">{f.label}</span>
                            <span className="text-xs text-stone-400 ml-2 hidden sm:inline">
                              {f.description}
                            </span>
                          </div>
                          <span
                            className={`text-xs font-medium flex-shrink-0 ${
                              f.value === 0 ? 'text-emerald-600' : 'text-stone-500'
                            }`}
                          >
                            {f.value === 0 ? 'Included' : `+GHS ${f.value.toLocaleString()}`}
                          </span>
                        </label>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline & revisions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200/60">
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
                  Timeline
                </label>
                <select
                  value={timeline}
                  onChange={e => setTimeline(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-200 text-sm bg-white"
                >
                  {timelines.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                      {t.multiplier > 1 ? ' (+30%)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200/60">
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
                  Revision rounds
                </label>
                <select
                  value={revisions}
                  onChange={e => setRevisions(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-200 text-sm bg-white"
                >
                  {revisionOptions.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                      {r.cost > 0 ? ` (+GHS ${r.cost})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Right column — results */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-6 space-y-4">
              {/* Price card */}
              <div className="bg-navy-500 rounded-xl p-6 text-white shadow-lg animate-in">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-navy-200 uppercase tracking-widest">
                    Recommended price
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      result.tier === 'Starter'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : result.tier === 'Professional'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {result.tier}
                  </span>
                </div>
                <div
                  className="text-3xl sm:text-4xl font-bold mt-2 tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  GHS {result.minPrice.toLocaleString()}
                  <span className="text-lg sm:text-xl text-navy-300 font-normal">
                    {' '}– {result.maxPrice.toLocaleString()}
                  </span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-lg px-3 py-2.5">
                    <p className="text-[10px] text-navy-300 uppercase tracking-wider">
                      30% deposit
                    </p>
                    <p className="text-lg font-semibold mt-0.5">
                      GHS {result.deposit.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg px-3 py-2.5">
                    <p className="text-[10px] text-navy-300 uppercase tracking-wider">
                      70% balance
                    </p>
                    <p className="text-lg font-semibold mt-0.5">
                      GHS {result.balance.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-white rounded-xl shadow-sm border border-stone-200/60 overflow-hidden">
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition"
                >
                  <span>Price breakdown</span>
                  <span
                    className="text-stone-400 transition-transform"
                    style={{
                      transform: showBreakdown ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    ▾
                  </span>
                </button>
                {showBreakdown && (
                  <div className="px-5 pb-4 space-y-2 border-t border-stone-100">
                    <div className="flex justify-between py-2 text-sm">
                      <span className="text-stone-500">
                        Base ({result.projectLabel})
                      </span>
                      <span className="font-medium">GHS {result.baseRate.toLocaleString()}</span>
                    </div>
                    {result.pageCost > 0 && (
                      <div className="flex justify-between py-1 text-sm">
                        <span className="text-stone-500">
                          +{pages - 5} extra pages
                        </span>
                        <span className="font-medium">
                          GHS {result.pageCost.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {result.selectedFeatureDetails.map(f => (
                      <div key={f.label} className="flex justify-between py-1 text-sm">
                        <span className="text-stone-500">{f.label}</span>
                        <span className="font-medium">GHS {f.cost.toLocaleString()}</span>
                      </div>
                    ))}
                    {result.revisionCost > 0 && (
                      <div className="flex justify-between py-1 text-sm">
                        <span className="text-stone-500">Extra revisions</span>
                        <span className="font-medium">
                          GHS {result.revisionCost.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {result.rushCost > 0 && (
                      <div className="flex justify-between py-1 text-sm text-amber-700">
                        <span>Rush fee (30%)</span>
                        <span className="font-medium">
                          GHS {result.rushCost.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 text-sm border-t border-stone-100 mt-1">
                      <span className="text-stone-400 text-xs">+15% buffer included in range</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Hosting */}
              <div className="bg-gold-50 rounded-xl p-5 border border-gold-200/60">
                <p className="text-xs font-medium text-gold-700 uppercase tracking-wider mb-3">
                  Hosting & domain (annual, separate)
                </p>
                <div className="space-y-1.5 text-sm">
                  {Object.entries(hostingTiers).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gold-800/70">{val.label}</span>
                      <span className="text-gold-800 font-medium">
                        GHS {val.min}–{val.max}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-gold-200/60 font-semibold text-gold-900">
                    <span>Total / year</span>
                    <span>
                      GHS {result.hostingMin}–{result.hostingMax}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={handleExportPDF}
                  className="w-full bg-navy-500 hover:bg-navy-600 text-white py-3.5 rounded-xl font-medium text-sm transition-all active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export quote as PDF
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-medium text-sm transition-all active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Share via WhatsApp
                </button>
                <button
                  onClick={handleCopy}
                  className="w-full bg-white hover:bg-stone-50 text-stone-700 py-3.5 rounded-xl font-medium text-sm transition-all active:scale-[0.98] border border-stone-200 flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy summary
                    </>
                  )}
                </button>
              </div>

              {/* Footer note */}
              <p className="text-[11px] text-stone-400 text-center leading-relaxed px-2">
                Prices based on Ghana web development market rates. The 15% buffer
                accounts for scope adjustments. Hosting billed annually, separate from
                project fee.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-navy-500 text-white/60 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span>WesleyConsults — Takoradi, Ghana</span>
          <span>wesleyconsults@gmail.com • 0500610780</span>
        </div>
      </footer>
    </div>
  );
}
