import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();

// Setup
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://chrizty90888:e2gGjiGDtvoH0xkY@todolist.vvynwcg.mongodb.net/?retryWrites=true&w=majority&appName=toDoList"
).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Schema & Model
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Post = mongoose.model("Post", postSchema);

// Routes
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.render("home", { posts });
  } catch (err) {
    res.status(500).send("Database error");
  }
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", async (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  try {
    await post.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Failed to save post");
  }
});

app.post("/delete/:postId", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Failed to delete post");
  }
});

app.get("/posts/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (post) {
      res.render("post", { post });
    } else {
      res.status(404).send("Post not found");
    }
  } catch (err) {
    res.status(500).send("Error retrieving post");
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});


