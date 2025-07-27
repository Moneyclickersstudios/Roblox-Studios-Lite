# Overview

This is a Roblox Studio-like 3D development environment built with React, Three.js, and Express. The application provides a comprehensive interface for creating and editing 3D scenes with objects, scripts, and properties similar to Roblox Studio.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript and leverages Three.js for 3D rendering through React Three Fiber. The architecture follows a modular component structure with:

- **Component-based UI**: Uses Radix UI components with custom styling via Tailwind CSS
- **3D Rendering**: React Three Fiber for Three.js integration with additional helpers from Drei
- **State Management**: Zustand stores for global state management
- **Styling**: Tailwind CSS with custom design system and CSS variables

### Backend Architecture
The backend uses Express.js with TypeScript in ESM format, featuring:

- **RESTful API**: Express server with route registration pattern
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Development Server**: Integrated Vite development server for hot reloading
- **Database Ready**: Drizzle ORM configured for PostgreSQL with user schema

### Build System
- **Frontend**: Vite for development and building
- **Backend**: ESBuild for server compilation
- **TypeScript**: Unified configuration across client/server/shared code
- **Development**: Integrated development environment with hot reloading

## Key Components

### 3D Studio Interface
- **Viewport3D**: Main 3D scene renderer with object manipulation
- **Explorer**: Hierarchical object tree browser
- **Properties**: Object property editor panel
- **Toolbar**: Tool selection and project management
- **ScriptEditor**: Code editor for object scripts

### Object Management
- **GameObject System**: Comprehensive 3D object model with properties
- **Manipulation Tools**: Select, move, rotate, scale tools
- **Material System**: Support for different materials (Plastic, Metal, Neon, Glass)
- **Shape Support**: Block, Ball, Cylinder, Wedge primitive shapes

### Project System
- **Save/Load**: JSON-based project serialization
- **Export**: RBLX format export capability
- **Version Control**: Project dirty state tracking

### State Management
- **useObjects**: Object hierarchy and manipulation
- **useStudio**: UI state and tool selection
- **useGame**: Game state management
- **useAudio**: Audio system management

## Data Flow

1. **Object Creation**: User selects tool → Creates object via useObjects → Renders in Viewport3D
2. **Object Selection**: User clicks object → Updates selectedObjectId in useStudio → Properties panel updates
3. **Property Editing**: User modifies property → updateObject in useObjects → Real-time 3D update
4. **Project Operations**: Save/Load through projectManager → JSON serialization → File system

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18 with TypeScript support
- **3D Graphics**: Three.js via React Three Fiber and Drei
- **UI Components**: Radix UI primitive components
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand with subscriptions
- **Query Management**: TanStack React Query

### Backend Dependencies
- **Server Framework**: Express.js with TypeScript
- **Database**: Drizzle ORM with PostgreSQL support via Neon
- **Session Management**: Connect-pg-simple for PostgreSQL sessions
- **Development**: TSX for TypeScript execution

### Development Tools
- **Build Tools**: Vite, ESBuild, PostCSS
- **TypeScript**: Strict configuration with path mapping
- **Database Tools**: Drizzle Kit for migrations and schema management

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: TSX with automatic restart
- **Database**: PostgreSQL via DATABASE_URL environment variable

### Production
- **Build Process**: 
  1. Vite builds frontend to `dist/public`
  2. ESBuild bundles server to `dist/index.js`
- **Server**: Node.js with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Environment**: Configured via environment variables

### Database Schema
- **Users Table**: Basic user authentication with username/password
- **Extensible**: Schema designed for expansion with additional game objects and relationships

The application is structured as a full-stack TypeScript application with clear separation between client, server, and shared code, making it easy to extend with additional features and maintain code consistency across the entire stack.