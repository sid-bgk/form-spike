# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This repository contains a forms demonstration project with the main application in the `formSpike/` directory. The project is a React + TypeScript + Vite application that showcases different form libraries and approaches.

## Development Commands

All commands should be run from the `formSpike/` directory:

```bash
cd formSpike
npm run dev        # Start development server
npm run build      # Build for production (runs TypeScript compiler + Vite build)
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
```

## Architecture Overview

The application demonstrates three different form handling approaches:

### 1. TanStack Form (@tanstack/react-form)
- **Location**: `src/pages/tanForms/`
- **Configs**: `src/configs/tanstackConfig/`
- Form components that use TanStack's reactive form library
- Includes basic forms, job details, personal info, property info, and multi-step applications

### 2. JSON Forms (@jsonforms/react)
- **Location**: `src/pages/jsonForms/`
- **Configs**: `src/configs/jsonForms/`
- **Custom Renderers**: `src/jsonforms/shadcn/`
- Schema-driven forms with custom Shadcn UI cell renderers
- Uses vanilla renderers as base with custom Shadcn components

### 3. Formik Forms
- **Location**: `src/pages/formIk/`
- **Configs**: `src/configs/formIkConfig/`
- Traditional Formik-based form implementations

### UI Components
- **Location**: `src/components/ui/`
- Shadcn UI components (Button, Input, Label, Checkbox, Select)
- Styled with Tailwind CSS v4

### Navigation
- React Router DOM for client-side routing
- Main navigation in `App.tsx` with links to different form demonstrations

## Key Dependencies

- **Forms**: @tanstack/react-form, @jsonforms/react, formik
- **UI**: Shadcn UI components with Radix UI primitives
- **Styling**: Tailwind CSS v4 with @tailwindcss/vite plugin
- **Build**: Vite with React plugin and TypeScript support

## Path Aliases

The project uses `@/` alias pointing to `src/` directory configured in `vite.config.ts`.