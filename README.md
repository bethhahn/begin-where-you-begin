# Meditation App - Setup and Deployment Guide

## Local Development Issues and Solutions

If you encounter issues with the local development server:
1. Multiple ports being used (3000-3006)
2. Webpack cache errors
3. Invalid configuration warnings
4. Audio not playing
5. Server stalling

Follow these steps:

### 1. Clean Up Local Environment
```bash
# Stop all running Next.js processes
# Delete build artifacts and dependencies
rm -rf .next node_modules package-lock.json

# Reinstall dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

## Moving to GitHub and Vercel (Recommended)

### A. Push to GitHub
1. Create a new repository on GitHub
   - Go to [github.com](https://github.com)
   - Click "+" in top right
   - Choose "New repository"
   - Name it "meditation-app"
   - Keep it public or private (your choice)
   - Don't initialize with README (we already have one)

2. Push your code
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR-USERNAME/meditation-app.git
   git push -u origin main
   ```

### B. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Import your meditation-app repository
5. Vercel will automatically:
   - Detect Next.js configuration
   - Build and deploy your app
   - Give you a live URL

### C. Development Workflow
1. Make changes to your code
2. Commit and push to GitHub
3. Vercel will automatically deploy updates
4. Each branch/PR gets its own preview URL

## Project Structure

```
meditation-app/
├── app/                  # Next.js app directory
├── components/          # React components
├── public/             # Static files
│   └── sounds/        # Audio files
├── styles/            # CSS files
├── next.config.mjs    # Next.js configuration
└── package.json       # Dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## Troubleshooting

### Audio Issues
- Ensure `public/sounds/birdsong.mp3` exists
- Check browser console for errors
- Try interacting with the page before audio should play

### Build Issues
- Clear `.next` cache directory
- Reinstall dependencies
- Check next.config.mjs is minimal

### Port Issues
- Kill any running Next.js processes
- Try different ports (3000-3006)
- Check Activity Monitor for node processes

## Need Help?

- Check [Next.js Documentation](https://nextjs.org/docs)
- Visit [Vercel Help](https://vercel.com/help)
- Open an issue on GitHub 