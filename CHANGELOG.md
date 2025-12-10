# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Added new DEGIT AG experience covering the AI training platform and tooling evaluation initiative

### Changed
- Replaced profile, about, and project showcase images with WebP assets for faster loading times

### Technical
- Updated all dependencies to latest versions (excluding major updates) using npm
- Migrated the frontend stack to Next.js 16 with the Bun toolchain and Tailwind CSS 4, replacing the Vite/React Router setup

### Fixed
- Aligned initial language selection between server and client to prevent hydration mismatch on localized headings
- Restored hero decorative badge positioning to match intended layout
- Removed Vitest page test files from `src/pages` to prevent Next.js build errors
- Normalized page filenames to lowercase to avoid 404s on case-sensitive deploys

## [0.1.0] – 2025-10-30

### Added
- CV generation functionality with PDF and DOCX support
- Email sending functionality with payload validation
- CV editor mode accessible via 7-click interaction
- Multi-language support (English and German) for CV documents
- Dynamic profile image handling in CV generation
- .cursorignore configuration file
- shadcn-ui component library integration
- Supabase integration for backend services
- LLMs.txt generation script for AI documentation
- Sitemap generation with pre-commit hook

### Changed
- Refactored SkillsSection component to use react-icons package
- Updated document generation logic for better maintainability
- Improved CV download button date formatting for consistency
- Last updated date in site content

### Fixed
- Adjusted cloud distance and sidebar width in CV layout
- Updated contact email and LinkedIn profile URL
- Cloudflare Pages deployment configuration

## [0.0.1] – 2025-10-13

### Added
- Initial portfolio website setup
- Hero section with profile image and animated decorative elements
- About section with personal introduction
- Experience section with timeline view
- Projects section showcasing highlighted work
- Skills section with technical competencies
- Contact section with email form
- CV page with multi-format download (PDF, DOCX)
- Theme switcher (light/dark mode)
- Language switcher (English/German)
- Responsive navigation header
- Footer with social links
- Imprint and privacy policy pages
- Sitemap page for SEO
- Project showcase images
- Favicon and site icons

### Changed
- Branding updated to christianerben.eu domain
- Site content refined with stakeholder communication skills
- Personal information updated
- Removed outdated SOC2 certification image
- Replaced US flag with CE custom image

[Unreleased]: https://github.com/keeperxy/christianerben-eu/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/keeperxy/christianerben-eu/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/keeperxy/christianerben-eu/releases/tag/v0.0.1
