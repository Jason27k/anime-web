# Next Steps for AnimeTrove

## Completed ✅

### Project Migration

- Migrated from Next.js 15.1.7 → 16.1.5
- Upgraded React 19.0.0 → 19.2.3
- Migrated Tailwind CSS v3 → v4 with CSS-based configuration
- Updated all dependencies to latest versions
- Set up src/ directory structure
- Configured Clerk authentication
- Set up Drizzle ORM with PostgreSQL
- Migrated all 15 routes and 20+ components

### UI Improvements

- Refactored all hardcoded colors to use Tailwind design tokens
- Simplified calendar display options (removed 2 unnecessary view modes)
- Fixed dark mode and color inconsistencies

## To Do 📋

### Search Page Improvements

- [ ] Review and improve search page layout
- [ ] Simplify display options (similar to calendar)
- [ ] Improve filter UI/UX
- [ ] Consider mobile responsiveness

### General UI/UX

- [ ] Review homepage layout
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
- [ ] Add database connection string
- [ ] Run database migrations: `npm run db:push`

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate database migrations
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## Notes

- Homepage is in good shape
- Calendar is simplified and ready
- Search page needs attention next
- All colors now use design tokens for easy theming
- Dark mode is default

ASIDE WRITTEN BY JASON
Add animations (and possible toast notifications) to the myanime/stats page
change dialog menu for something that looks better
change top right badge to something that better suits the page
make language option chosen affect the titles in the page
update navbar to reflect changes (maybe make this page pop up when user clicks their profile picture)
update details page and dialogs for adding anime to list
update loading skeleton for myanime/settings page
