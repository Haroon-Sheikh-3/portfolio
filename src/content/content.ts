// The ONLY place copy lives. All values are DEMO content supplied for this
// build — every string marked [DEMO] must be replaced with real material
// before launch (see docs/PRESERVATION.md). Nothing here is invented beyond
// plausible demo copy; real facts must be supplied by the owner.

export type Project = (typeof PROJECTS)[number];

export const META = {
  name: '[DEMO: full name — e.g. Amara Okonkwo]',
  role: 'Creative Technologist · WebGL & Shaders',
  location: '[DEMO: city, country — e.g. Lisbon, Portugal]',
  status: '[DEMO: availability — e.g. "Available for select work"]',
  email: '[DEMO: contact email — e.g. hello@example.com]',
  bio: [
    '[DEMO: bio sentence 1 — who I am and what I build.]',
    '[DEMO: bio sentence 2 — the craft angle or the thing I care about.]',
    '[DEMO: bio sentence 3 — a concrete signal of what sets the work apart.]',
  ],
  summary: '[DEMO: one-line summary for SEO / meta description.]',
};

export const SOCIALS = [
  { label: '[DEMO: social — e.g. GitHub]', url: '[DEMO: url]', handle: '[DEMO: handle]' },
  { label: '[DEMO: social]', url: '[DEMO: url]', handle: '[DEMO: handle]' },
  { label: '[DEMO: social]', url: '[DEMO: url]', handle: '[DEMO: handle]' },
];

export const STACK = [
  {
    group: 'Front-end',
    items: [
      { name: '[DEMO: stack]', note: '[DEMO: what I built with it]', years: '[DEMO: e.g. 2020—now]' },
      { name: '[DEMO: stack]', note: '[DEMO: what I built with it]', years: '[DEMO: e.g. 2021—now]' },
      { name: '[DEMO: stack]', note: '[DEMO: what I built with it]', years: '[DEMO: e.g. 2019—now]' },
    ],
  },
  {
    group: 'Python / AI',
    items: [
      { name: '[DEMO: stack]', note: '[DEMO: what I built with it]', years: '[DEMO: e.g. 2022—now]' },
      { name: '[DEMO: stack]', note: '[DEMO: what I built with it]', years: '[DEMO: e.g. 2022—now]' },
    ],
  },
  {
    group: 'CMS / e-commerce',
    items: [
      { name: '[DEMO: stack]', note: '[DEMO: what I built with it]', years: '[DEMO: e.g. 2020—now]' },
    ],
  },
  {
    group: 'Tools',
    items: [
      { name: '[DEMO: stack]', note: '[DEMO: what I built with it]', years: '[DEMO: e.g. 2021—now]' },
    ],
  },
];

export const PROJECTS = [
  {
    index: '01',
    title: '[DEMO: project title]',
    outcome: '[DEMO: one-line outcome]',
    role: '[DEMO: role on this project]',
    year: '[DEMO: year]',
    stack: ['[DEMO: WebGL]', '[DEMO: Three.js]', '[DEMO: Shaders]'],
    link: '[DEMO: live URL]',
    github: '[DEMO: GitHub URL]',
    image: '/images/projects/placeholder-01.jpg',
    context: '[DEMO: context — the problem or the brief.]',
    challenge: '[DEMO: challenge — what was hard.]',
    approach: '[DEMO: approach — how I solved it.]',
    decisions: '[DEMO: decisions — the deliberate trade-offs.]',
    result: '[DEMO: result — what happened, with real numbers if available.]',
  },
  {
    index: '02',
    title: '[DEMO: project title]',
    outcome: '[DEMO: one-line outcome]',
    role: '[DEMO: role on this project]',
    year: '[DEMO: year]',
    stack: ['[DEMO: GSAP]', '[DEMO: Canvas]', '[DEMO: WebGL]'],
    link: '[DEMO: live URL]',
    github: '[DEMO: GitHub URL]',
    image: '/images/projects/placeholder-02.jpg',
    context: '[DEMO: context.]',
    challenge: '[DEMO: challenge.]',
    approach: '[DEMO: approach.]',
    decisions: '[DEMO: decisions.]',
    result: '[DEMO: result.]',
  },
  {
    index: '03',
    title: '[DEMO: project title]',
    outcome: '[DEMO: one-line outcome]',
    role: '[DEMO: role on this project]',
    year: '[DEMO: year]',
    stack: ['[DEMO: tag]', '[DEMO: tag]'],
    link: '[DEMO: live URL]',
    github: '[DEMO: GitHub URL]',
    image: '/images/projects/placeholder-03.jpg',
    context: '[DEMO: context.]',
    challenge: '[DEMO: challenge.]',
    approach: '[DEMO: approach.]',
    decisions: '[DEMO: decisions.]',
    result: '[DEMO: result.]',
  },
];

export const MILESTONES = [
  { year: '[DEMO: year]', label: '[DEMO: milestone — shipped project, stack learned, repo published]', description: '[DEMO: brief description of the milestone and its impact]' },
  { year: '[DEMO: year]', label: '[DEMO: milestone]', description: '[DEMO: brief description of the milestone and its impact]' },
  { year: '[DEMO: year]', label: '[DEMO: milestone]', description: '[DEMO: brief description of the milestone and its impact]' },
];

export const CONTACT = {
  headline: '[DEMO: contact headline — huge display line]',
  cta: '[DEMO: primary CTA label, e.g. "Start a project"]',
  ctaHref: '[DEMO: CTA link]',
  availability: '[DEMO: availability status]',
  localTime: '[DEMO: e.g. "Local time: 14:42 · GMT+2"]',
  email: '[DEMO: contact email — e.g. hello@example.com]',
  socialLinks: SOCIALS,
};