# Node.js 22 Compatibility Upgrade

This project has been successfully upgraded to be compatible with Node.js 22.

## Changes Made

### 1. Package Configuration
- Added `engines` field in `package.json` to specify Node.js 22+ requirement
- Updated npm version requirement to 10.0.0+

### 2. TypeScript Configuration
- Updated `target` from `ES2020` to `ES2022` in `tsconfig.json`
- Updated `lib` array to include `ES2022` features
- Updated build script to target `es2022`

### 3. Node Version Management
- Created `.nvmrc` file specifying Node.js version 22
- Updated Vercel deployment configuration to use `nodejs22.x` runtime

### 4. Dependencies
- Reinstalled all dependencies with Node.js 22
- Updated key packages to latest compatible versions
- Resolved engine compatibility warnings

## Requirements

- **Node.js**: >= 22.0.0
- **npm**: >= 10.0.0

## Usage

### Using NVM (Recommended)
```bash
# Install and use Node.js 22
nvm install 22
nvm use 22

# Install dependencies
npm install

# Start development server
npm run dev
```

### Manual Node.js Installation
Ensure you have Node.js 22 or later installed, then:
```bash
npm install
npm run dev
```

## Verification

To verify the upgrade was successful:

1. Check Node.js version: `node --version` (should be v22.x.x)
2. Run TypeScript check: `npm run check`
3. Build the project: `npm run build`
4. Build the API: `npm run build:api`
5. Start development server: `npm run dev`

## TestSprite Compatibility

This upgrade makes the project compatible with TestSprite MCP, which requires Node.js 22 or higher.

## Deployment

The project is configured for deployment with Node.js 22:
- Vercel: Uses `nodejs22.x` runtime
- Other platforms: Ensure Node.js 22+ is available

## Notes

- All existing functionality remains intact
- Performance improvements from Node.js 22 features
- Better ES2022 support and modern JavaScript features
- Enhanced security and stability