const express = require("express");
const Task = require("../models/Task");
const router = new express.Router();
const auth = require("../middlewares/auth");

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });
  try {
    const result = await task.save();
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=10 (limit is how many you want, skip is how many items you wanna skip to start limiting)
//GET /tasks?sortBy=createdAt_asc or(desc)

router.get("/tasks",auth ,async (req, res) => {
  const match = {}
  const sort = {}
  if(req.query.completed){
    match.completed = req.query.completed === 'true'
  }

  if(req.query.sortBy){
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }
  try {
    await req.user.populate({
      path:'tasks',
      match,
      options:{
        limit:parseInt(req.query.limit),
        skip:parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    return res.status(200).json(req.user.tasks);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.get("/tasks/:id",auth ,async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id,owner:req.user._id });
    if (!task) {
      return res.status(400).json({ error: "task not found" });
    }
    return res.status(200).json(task);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.patch("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const updates = Object.keys(req.body);
    updates.forEach(update => {
      task[update] = req.body[update];
    });
    task.save();
    if (!task) {
      return res.status(200).json({ info: "task not found" });
    }
    return res.status(200).json(task);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.delete('/tasks/:id',auth,async(req,res)=>{
  try{
    const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
    if(!task){
      res.status(404).save()
    }
    res.send(task)
  }catch(e){
    res.status(500).send()
  }
})

module.exports = router;
