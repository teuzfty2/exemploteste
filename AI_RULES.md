# AI Development Rules

## Tech Stack
- **Framework**: React 19 with TypeScript for type safety and modern features.
- **Build Tool**: Vite for fast development and optimized production builds.
- **Styling**: Tailwind CSS for utility-first styling and responsive design.
- **UI Components**: shadcn/ui (Radix UI based) for accessible and customizable components.
- **Icons**: Lucide React for a consistent and scalable icon set.
- **Routing**: React Router for client-side navigation.
- **State Management**: React Hooks (useState, useReducer, useContext) for local and global state.

## Development Rules

### 1. Component Architecture
- **Location**: Place reusable UI components in `src/components/` and page-level components in `src/pages/`.
- **Granularity**: Keep components small and focused (ideally under 100 lines). Create new files for every new component.
- **Naming**: Use PascalCase for component files (e.g., `Button.tsx`) and camelCase for utility files.

### 2. Styling & Design
- **Tailwind First**: Always use Tailwind CSS classes for styling. Avoid writing custom CSS in `.css` files unless absolutely necessary.
- **Responsiveness**: Design with a mobile-first approach using Tailwind's responsive modifiers (`sm:`, `md:`, `lg:`, etc.).
- **Theming**: Utilize the existing CSS variables for colors and spacing to maintain brand consistency.

### 3. UI Library (shadcn/ui)
- **Preference**: Always check if a component exists in the shadcn/ui library before building a custom one.
- **Customization**: If a shadcn component needs modification, create a wrapper component in `src/components/` rather than editing the base library files.

### 4. Routing
- **Centralized Routes**: Keep all route definitions in `src/App.tsx`.
- **Lazy Loading**: Use React.lazy for page components to improve initial load performance.

### 5. Icons
- **Lucide**: Exclusively use `lucide-react` for icons to ensure visual consistency.

### 6. Code Quality
- **TypeScript**: Avoid using `any`. Define proper interfaces and types for props and state.
- **Simplicity**: Prioritize readable and maintainable code over complex "clever" solutions.
- **Error Handling**: Let errors bubble up to the global handler unless specific local recovery is required.