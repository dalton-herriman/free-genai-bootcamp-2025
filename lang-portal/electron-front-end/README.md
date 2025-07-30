# Language Learning Portal - Electron Frontend

A modern Electron-based frontend for the Language Learning Portal backend API.

## Features

- **Dashboard**: View study statistics and recent sessions
- **Words**: Browse and search vocabulary with pagination
- **Groups**: Manage word groups and view their contents
- **Study Sessions**: Create and manage study sessions
- **Study Activities**: Launch and track study activities

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- The backend Flask server running on `http://localhost:5000`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure the backend server is running:
```bash
cd ../backend-flask
python app.py
```

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start the Electron app with DevTools open for debugging.

### Production Mode
```bash
npm start
```

## API Endpoints Used

The frontend integrates with the following backend endpoints:

### Dashboard
- `GET /dashboard/stats` - Get study statistics
- `GET /dashboard/recent-session` - Get most recent session

### Words
- `GET /words` - Get paginated words list

### Groups
- `GET /groups` - Get paginated groups list

### Study Sessions
- `GET /api/study-sessions` - Get paginated study sessions
- `POST /api/study-sessions` - Create new study session

### Study Activities
- `GET /api/study-activities` - Get all study activities

## Project Structure

```
electron-front-end/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── renderer.js         # Main JavaScript logic
├── main.js            # Electron main process
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## Development

### Adding New Features

1. **New API Endpoints**: Add new functions in `renderer.js` following the existing pattern
2. **New UI Sections**: Add HTML in `index.html` and corresponding CSS in `styles.css`
3. **Styling**: Use the existing CSS classes for consistency

### Key Functions

- `apiCall(endpoint, options)` - Generic API call function
- `loadSectionData(section)` - Load data for different sections
- `showModal(title, content)` - Display modal dialogs
- `initNavigation()` - Handle sidebar navigation

## Troubleshooting

### Common Issues

1. **Backend Connection Error**: Make sure the Flask server is running on port 5000
2. **CORS Issues**: The backend should have CORS enabled (already configured)
3. **Electron Build Issues**: Try running `npm install` again

### Debug Mode

Run with DevTools open:
```bash
npm run dev
```

This will show the browser console for debugging API calls and JavaScript errors.

## Building for Distribution

To create distributable packages:

```bash
npm run build
```

This requires `electron-builder` to be installed globally or as a dev dependency.

## Contributing

1. Follow the existing code style and patterns
2. Test API integration with the backend
3. Ensure responsive design works on different screen sizes
4. Add error handling for API failures 