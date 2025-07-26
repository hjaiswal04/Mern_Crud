const express = require("express");
const app = express();
const path = require("path");
const userModel = require('./models/user');

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Set the directory for views (optional if default is used)
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render("index"); 
});

app.get('/read', async (req, res) => {
    let users = await userModel.find()
    res.render("read",{users});
});

app.post('/create', async (req, res) => {
    try {
        let { name, email, image } = req.body;
        let createdUser = await userModel.create({ name, email, image });
        res.redirect("/read"); // or redirect, or render success
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating user");
    }
});

app.get('/edit/:id', async (req, res) => {
  try {
    const user = await userModel    .findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render('edit', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});



app.post('/edit/:id', async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email: req.body.email,
      image: req.body.image,
    });
    res.redirect('/read');
  } catch (err) {
    res.status(500).send("Update failed");
  }
});


app.get('/delete/:id', async (req, res) => {
    let users = await userModel.findOneAndDelete({_id: req.params.id}); 
    res.redirect("/read");
});



// Start server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
