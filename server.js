
//! Address: 31.56.39.143
//! Port: 22
//! User: root
//! Password: L5J7wGNCjVJ1tXByFUVX

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const readUsersFromFile = () => {
  const data = fs.readFileSync("users.json");
  return JSON.parse(data);
};

const writeUsersToFile = (users) => {
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
};

//? Login endpoint !(username/password)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const users = readUsersFromFile();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    res.json({
      success: true,
      serverList: user.serverList,
      isAdmin: user.isAdmin,
      credential: {
        username: user.username,
        password: user.password,
      },
    });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }
});

//? Add server into serverList
app.post("/add-server", (req, res) => {
  const { username, password, server } = req.body;

  console.log("/add-server ", req.body);
  let users = readUsersFromFile();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }

  if (user.serverList.includes(server)) {
    return res
      .status(400)
      .json({ success: false, message: "Server already exists in serverList" });
  }

  user.serverList.push(String(server));
  writeUsersToFile(users);

  console.log(`Server ${server} added to ${username}'s serverList`);
  res.json({
    success: true,
    message: `Server ${server} has been added to ${username}'s serverList`,
  });
});

//? Remove server into serverList
app.delete("/delete-server", (req, res) => {
  const { username, password, server } = req.body;

  let users = readUsersFromFile();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }

  const serverIndex = user.serverList.indexOf(server);
  if (serverIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Server not found in serverList" });
  }

  user.serverList.splice(serverIndex, 1);
  writeUsersToFile(users);

  console.log(`Server ${server} removed from ${username}'s serverList`);
  res.json({
    success: true,
    message: `Server ${server} has been removed from ${username}'s serverList`,
  });
});

//? Get user serverList
app.get("/server", (req, res) => {
  const { username, password } = req.query;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required" });
  }

  let users = readUsersFromFile();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }

  res.json({
    success: true,
    serverList: user.serverList,
  });
});

//? Endpoint to add data to bot-backup
app.post('/add-bot-backup', (req, res) => {
  const { username, password, bots } = req.body;

  if (!username || !password || !Array.isArray(bots)) {
      return res.status(400).json({ success: false, message: 'Username, password, and bots array are required' });
  }

  let users = readUsersFromFile();

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }

  user['bot-backup'] = user['bot-backup'] || [];
  user['bot-backup'] = user['bot-backup'].concat(bots);

  writeUsersToFile(users);

  console.log(`Bots added to ${username}'s bot-backup`);

  res.json({ success: true, message: 'Bots added to bot-backup' });
});

//? Endpoint to delete data in bot-backup
app.delete("/remove-bot-backup", (req, res) => {
  const { username, password, botUsername } = req.body;

  if (!username || !password || !botUsername) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Username, password, and botUsername are required",
      });
  }

  let users = readUsersFromFile();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }

  const botIndex = user["bot-backup"].findIndex(
    (bot) => bot.username === botUsername
  );
  if (botIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Bot not found in bot-backup" });
  }

  user["bot-backup"].splice(botIndex, 1);
  writeUsersToFile(users);

  console.log(
    `Bot with username ${botUsername} removed from ${username}'s bot-backup`
  );

  res.json({
    success: true,
    message: `Bot with username ${botUsername} removed from bot-backup`,
  });
});

app.put("/update-bot-backup", (req, res) => {
  const { username, password, botUsername, updatedData } = req.body;

  if (!username || !password || !botUsername || !updatedData) {
    return res.status(400).json({
      success: false,
      message: "Username, password, botUsername, and updatedData are required",
    });
  }

  let users = readUsersFromFile();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }

  const botIndex = user["bot-backup"].findIndex(
    (bot) => bot.username === botUsername
  );
  if (botIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Bot not found in bot-backup" });
  }

  // Replace the bot data with the new data
  user["bot-backup"][botIndex] = updatedData;

  // Save updated users data
  writeUsersToFile(users);

  console.log(
    `Bot with username ${botUsername} updated for user ${username}`
  );

  res.json({
    success: true,
    message: `Bot with username ${botUsername} updated successfully`,
    updatedBot: user["bot-backup"][botIndex],
  });
});


//? Endpoint to view a user's bot-backup
app.get("/view-bot-backup", (req, res) => {
  const { username, password } = req.query;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required" });
  }

  // Read users data from file
  let users = readUsersFromFile();

  // Find user
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }

  // Respond with bot-backup data
  res.json({
    success: true,
    botBackup: user["bot-backup"] || [], // Default to empty array if bot-backup does not exist
  });
});


//? Endpoint for an administrator to view all users and their data
app.get('/admin/users', (req, res) => {
  const { username, password } = req.query;

  // Check if the username and password are provided
  if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  let users = readUsersFromFile();

  // Find the user by username and password
  const adminUser = users.find(u => u.username === username && u.password === password);
  if (!adminUser) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }

  // Check if the user is an admin
  if (!adminUser.isAdmin) {
      return res.status(403).json({ success: false, message: 'You are not authorized to view all users' });
  }

  // Return all users' data if the requester is an admin
  res.json({
      success: true,
      users: users
  });
});

app.post("/add-router", (req, res) => {
  const { username, password, router } = req.body;

  if (!username || !password || !router) {
    return res.status(400).json({
      success: false,
      message: "Username, password, and router are required",
    });
  }

  let users = readUsersFromFile();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  }

  if (user.routerList.includes(router)) {
    return res.status(400).json({ success: false, message: "Router already exists in routerList" });
  }

  user.routerList.push(String(router));
  writeUsersToFile(users);

  console.log(`Router ${router} added to ${username}'s routerList`);
  res.json({
    success: true,
    message: `Router ${router} has been added to ${username}'s routerList`,
  });
});

app.delete("/remove-router", (req, res) => {
  const { username, password, router } = req.body;

  if (!username || !password || !router) {
    return res.status(400).json({
      success: false,
      message: "Username, password, and router are required",
    });
  }

  let users = readUsersFromFile();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  }

  const routerIndex = user.routerList.indexOf(router);
  if (routerIndex === -1) {
    return res.status(404).json({ success: false, message: "Router not found in routerList" });
  }

  user.routerList.splice(routerIndex, 1);
  writeUsersToFile(users);

  console.log(`Router ${router} removed from ${username}'s routerList`);
  res.json({
    success: true,
    message: `Router ${router} has been removed from ${username}'s routerList`,
  });
});

app.put("/update-router", (req, res) => {
  const { username, password, oldRouter, newRouter } = req.body;

  if (!username || !password || !oldRouter || !newRouter) {
    return res.status(400).json({
      success: false,
      message: "Username, password, oldRouter, and newRouter are required",
    });
  }

  let users = readUsersFromFile();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  }

  const routerIndex = user.routerList.indexOf(oldRouter);
  if (routerIndex === -1) {
    return res.status(404).json({ success: false, message: "Old router not found in routerList" });
  }

  if (user.routerList.includes(newRouter)) {
    return res.status(400).json({ success: false, message: "New router already exists in routerList" });
  }

  user.routerList[routerIndex] = String(newRouter);
  writeUsersToFile(users);

  console.log(`Router ${oldRouter} updated to ${newRouter} for ${username}`);
  res.json({
    success: true,
    message: `Router ${oldRouter} has been updated to ${newRouter}`,
  });
});

app.get("/view-router-list", (req, res) => {
  const { username, password } = req.query;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  let users = readUsersFromFile();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  }

  res.json({
    success: true,
    routerList: user.routerList || [], // Return an empty array if routerList does not exist
  });
});

app.listen(80, () => {
  console.log("Backend server running on port 3000");
});