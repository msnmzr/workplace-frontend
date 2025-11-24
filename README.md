# Hum Leopards

Hum Leopards Portal is a web application designed to manage and display employee information for Leopards organization. It provides a centralized platform for managing employee profiles, leaves, performance records, and other HR-related data with centralized user authentication using Active Directory.

The portal is built using Next.js for the frontend and Laravel 12 for the backend.


## Installation & Setup

Navigate to project root:
```
cd workplace-frontend
npm install
```


Add .env.local with API URL:
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Start the Next.js development server:

```
npm run dev
```


## Authentication
Employees log in using Active Directory credentials.

Laravel validates AD credentials and fetches additional data from the local users table.

Next.js stores authentication token securely and protects dashboard routes.

## Security Considerations

JWT/Sanctum token-based authentication.

Active Directory ensures company-wide secure login.

Role-based access control for admin and employee functionalities.

CSRF protection via Laravel middleware.

## Contact / Support

For any issues or assistance with the portal, please contact the HR or IT team.