# Next Steps for AnimeTrove

## Completed

### Project Migration

- Migrated from Next.js 15.1.7 → 16.1.5
- Upgraded React 19.0.0 → 19.2.3
- Migrated Tailwind CSS v3 → v4 with CSS-based configuration
- Updated all dependencies to latest versions
- Set up src/ directory structure
- Configured Clerk authentication
- Migrated from Drizzle ORM/PostgreSQL to external REST API
- Migrated all 15 routes and 20+ components

### UI Improvements

- Refactored all hardcoded colors to use Tailwind design tokens
- Simplified calendar display options (removed 2 unnecessary view modes)
- Fixed dark mode and color inconsistencies
- Improved navbar with icons on desktop, better hover states

## To Do

### Search Page Improvements

- [ ] Review and improve search page layout
- [ ] Simplify display options (similar to calendar)
- [ ] Improve filter UI/UX
- [ ] Consider mobile responsiveness

### General UI/UX

- [ ] Review homepage layout (consider calendar as homepage?)
- [ ] Improve loading states and skeleton screens
- [ ] Review anime detail page design
- [ ] Improve mobile menu experience
- [ ] Add transitions/animations where appropriate

### Performance

- [ ] Optimize image loading
- [ ] Review and optimize bundle size
- [ ] Add more granular loading states

### Features

- [ ] Test authentication flows thoroughly
- [ ] Test My Anime list functionality
- [ ] Verify all routes work with environment variables set

### Environment Setup

- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Add Clerk API keys
- [ ] Configure REST API endpoint

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Notes

- Homepage shows: Upcoming, Trending, Popular, Top Rated, Romance rows
- Calendar shows weekly airing schedule (filtered to popular TV/ONA)
- All colors now use design tokens for easy theming
- Dark mode is default
- Using external REST API for user data (my-anime lists)
