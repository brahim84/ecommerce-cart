<h1>ECommerce Shop With Admin Dashboard in Next.js and Node.js</h1>

<p><b>ECommerce shop with admin dashboard in Next.js and Node.js</b> is a <b>free eCommerce store</b> developed using Next.js, Node.js and MySQL. The application is completely built from scratch(custom design) and completely responsive.
Is a modern online shop that specializes in selling all types of electronic products. The goal of the project is to create a modern web application <b>by following key stages in software engineering</b>. 
</p>

<h2>Instructions</h2>
<ol>
  <li><p>To run the app you first need to download and install Node.js and npm.</p></li>
  <li><p>Download and install MySQL.</li>
  <li><p>You need to put the following code in the .env file</p></li>
</ol>

```
DATABASE_URL="mysql://username:password@localhost:3306/nzremote"
NEXTAUTH_SECRET=12D16C923BA17672F89B18C1DB22A
NEXTAUTH_URL=http://localhost:3000
```

<p>After that need to create another .env file in the server folder and put the same DATABASE_URL you used in the previous .env file:</p>

```
DATABASE_URL="mysql://username:password@localhost:3306/nzremote"
```

<p>Open your terminal in the root folder of the project and execute:</p>


```
npm install
```

<p>Navigate with the terminal in the server folder and execute:</p>

```
cd server
npm install
```

<p>Run the Prisma migration now. Make sure you are in the server folder and execute:</p>

```
npx prisma migrate dev
```

<p>Need to go to the server/utills folder and execute insertDemoData.js:</p>

```
cd utills
node insertDemoData.js
```

<p>Go back to the server folder and run the backend:</p>

```
cd ..
node app.js
```

<p>In the second terminal, run the front end:</p>

```
npm run dev
```

<p>Open <a href="http://localhost:3000" target="_blank">http://localhost:3000</a> and see its live!</p>

