const { Router } = require("express");
const User = require("../models/user");
const multer=require('multer')
const router = Router();
const path = require("path");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });



router.get("/signin", (req, res) => {
  return res.render("signin", {
    user: req.user,
  });
});

router.get("/signup", (req, res) => {
  return res.render("signup", {
    user: req.user,
  });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    console.log("user signedin");
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",user: req.user,
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/user/signin");
});

// router.post("/signup", upload.single("coverImage"), async (req, res) => {
//   const { fullName, email, password } = req.body;
  
//   await User.create({
//     fullName,
//     email,
//     password,
//     profileImageURL: `/uploads/${req.file.filename}`,
//   });
//   console.log("user signedup")
//   return res.redirect("/user/signin");
// });

router.post("/signup", upload.single("photo"), async (req, res) => {
  const { fullName, email, password } = req.body;
  const photo = req.file?.filename;

  await User.create({
    fullName,
    email,
    password,
    profileImageURL: photo ? `/uploads/${photo}` : "/images/default.png",
  });

  console.log("User signed up");
  return res.redirect("/user/signin");
});


module.exports = router;
