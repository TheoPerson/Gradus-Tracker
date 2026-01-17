# Gradus

**The Ultimate League of Legends Data Encyclopedia**

Gradus is the modern web interface powered by **Gradus DB**, providing a comprehensive exploration of League of Legends content.

## 🏛️ Architecture

### **Gradus** (Frontend)

The beautiful, glassmorphic web interface built with Vue 3 and TypeScript. It provides the visual experience for:

- ⚔️ **Champions** - Detailed stats & abilities
- 🎨 **Skins** - Splash arts & rarity tracking
- ⚡ **Items** - Build paths & analytics
- 🔮 **Runes** - Interactive rune trees
- 🏆 **Challenges** - Tracking system

### **Gradus DB** (Data Layer)

The robust, hidden backend service layer connecting to Riot's infrastructure:

- **Data Dragon Connector** (`versionService.ts`) - Auto-updates to latest patch (26.1.1+)
- **Community Dragon** - Asset retrieval for unlisted resources
- **Services** - Optimized API handling for Champions, Spells, Icons, and Wards

## 🌟 Features

- **170+ Champions**
- **1,600+ Skins**
- **200+ Items**
- **60+ Runes**
- **2,800+ Challenges**
- **500+ Emotes**
- **100+ Ward Skins**
- **1,000+ Icons**

## 🚀 Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Gradus DB** - Computed data services

## 📦 Development

```bash
# Install dependencies
npm install

# Start Gradus (Website)
npm run dev

# Build for production
npm run build
```

## 🌐 Deployment

Optimized for Vercel, Netlify, or any static hosting.

## ⚖️ Legal

Gradus isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.
