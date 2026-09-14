# Mobile App API Integration Notes

This file documents the API created to connect the Next.js backend with the React Native (Expo) mobile application.

## Created Endpoints

### `GET /api/news`
Fetches the latest news/posts (from the `Video` Prisma model) sorted by the most recent (`createdAt: "desc"`).

- **Local URL:** `http://localhost:3005/api/news`
- **Network URL (for Expo testing):** `http://192.168.70.110:3005/api/news` (Update the IP if your local Wi-Fi IP changes).

#### Response Format
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "News Title",
      "description": "Optional description",
      "type": "YOUTUBE", // "YOUTUBE", "REEL", "LIVE"
      "url": "https://...",
      "thumbnail": "https://...",
      "views": 100,
      "likes": 10,
      "isFeatured": false,
      "categoryId": 2,
      "createdAt": "2026-09-12T..."
    }
  ]
}
```

## Expo Integration Prompt

If you are using an AI assistant (like Cursor or Copilot) inside your Expo project, you can copy and paste the following prompt to automatically generate the React Native code to fetch this data:

> "I have a Next.js backend running locally on my computer. It has an API endpoint at `http://192.168.70.110:3005/api/news` that returns JSON data in this format: `{ "success": true, "data": [{ "id": 1, "title": "News Title", "description": "...", "url": "...", "thumbnail": "...", "type": "...", "createdAt": "..." }] }`.
> 
> Please update my React Native Expo app to fetch and display this news data. 
> 
> Requirements:
> 1. Create a service or use `useEffect` to fetch from `http://192.168.70.110:3005/api/news`. 
> 2. Handle loading states (show an ActivityIndicator while fetching).
> 3. Handle errors gracefully (e.g., if the backend is down).
> 4. Display the list of news in a `FlatList` showing the thumbnail, title, and description. Make it look modern and visually appealing."

## Next Steps
- When deploying to production, make sure to replace the local IP (`192.168.70.110:3005`) in your React Native app with your production domain name (e.g., `https://your-domain.com/api/news`).
- Add similar endpoints if you need to fetch Categories or Specific Video Types.
