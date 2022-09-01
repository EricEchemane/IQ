# /pages
- it contains the pages of the application
- the pages inside the /pages are the files ending in .tsx (Typescript XML)
- all files and folders inside this except /api folder, corresponds to certain route
- ex: pages/register.tsx = /register in the url
- so if the url is `https://localhost:3000`, the register.tsx file corresponds to `https://localhost:3000/register`

# /pages/api
- is the server of the application
- inside it is the files ending in .ts (Typescript) files
- the same as pages, it corresponds to urls such as `/api/user/login`
- if navigate to `/api` in url, it won't return a page because it is just for sending and receiving data through http