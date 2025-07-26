### Frotend code runner cmd:

```sh
cd frotend
npm install
npm run dev
```


### Backend code runner cmd:

```sh
cd backend
npm install
npm run dev 
```



### Things that contains inside the .env file

```env
MONGO_URL="mongodb+srv://<database-username>:<database-password>@<database-name>.mongodb.net/chatDB?retryWrites=true&w=majority&appName=Cluster0"

PORT=5001

JWT_SECRET=


NODE_ENV=development
NODE_ENV=production # for deployement time

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```