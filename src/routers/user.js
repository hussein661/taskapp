const express = require("express");
const User = require("../models/User");
const auth = require("../middlewares/auth");
const router = new express.Router();
const multer = require("multer");
const sharp = require('sharp')
const {sendWelcomeEmail,sendCancelEmail} = require('../emails/account')

router.get("/users/me", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.patch("/users/me", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    updates.forEach(update => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancelEmail(req.user.email,req.user.name)
    res.send(req.user);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(400).json({ error: "task not found" });
    }
    res.status(200).json({ info: "task has been deleted" });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const result = await user.save();
    sendWelcomeEmail(user.email,user.name)
    const token = await user.generateAuthToken();
    return res.status(200).json({ result, token });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken(user.id);
    res.send({ user, token });
  } catch (e) {
    res.status(200).json({ error: e.message });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

router.post("/users/logoutAll", auth, async (req, res, next) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error("Please upload an image file"));
    }
    cb(undefined, true);

    // cb(new Error('file must be a pdf'))
    // cb(undefined,true)
    // cb(undefined,false)
  }
});
router.delete('/users/me/avatar',auth,async(req,res)=>{
  req.user.avatar =  undefined
  await req.user.save()
  res.send()
})

router.post(
  "/users/me/avatar",auth,upload.single('avatar'),async (req, res, next) => {
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar =  buffer
     await req.user.save()
      res.send();
  },(error,req,res,next)=>{
    res.status(400).send({error:error.message})
  }
);

router.get('/users/:id/avatar',async (req,res)=>{
  try{
    const user = await User.findById(req.params.id)
    if(!user || !user.avatar){
      throw new Error()
    }
  res.set('Content-Type','image/jpg')
  res.send(user.avatar)
  }catch(e){
    res.status(404).send()
  }
})
module.exports = router;
