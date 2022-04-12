const express=require('express');
const router=express.Router();
const Notes = require("../models/Notes");
var fetchuser=require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

//Route 1:fetch all notes: GET "/api/notes/fetchallnotes".  require Auth
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try {
    const notes=await Notes.find({user:req.user.id});
    res.json(notes);
} catch (error) {
    console.error(error.message);
    res.status(500).send("internal error occured");
}
})

//Route 2:add new  notes: POST "/api/notes/addnotes".  require Auth
router.post('/addnotes',fetchuser,[
    body("title", "enter a valid title").isLength({ min: 4 }),
    body("description", "description must be of atleast 8 charcters").isLength({
      min: 8,
    })
    
],async (req,res)=>{
    try {
        const{title,description,tag}=req.body;
    
        //if there is error in validation,send bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const note=new Notes({
        title,description,tag,user:req.user.id
    })
    const savedNote=await note.save()
    res.json(savedNote);
} catch (error) {
    console.error(error.message);
    res.status(500).send("internal error occured");
}
    
})


//Route 3:update an existing note: PUT "/api/notes/updatenote".  require Auth
router.put('/updatenote/:id',fetchuser,async (req,res)=>{
    try {
        
const{title,description,tag}=req.body;
//create a new note object;
const newNote={};
if(title){newNote.title=title};
if(description){newNote.description=description};
if(tag){newNote.tag=tag};
 
//find the note to be updated and update it;
let note=await Notes.findById(req.params.id);
if(!note){return res.status(404).send("note not found")};

//check whether the requesting user is the owner of the note being updated;
if(note.user.toString()!==req.user.id)
{
    return res.status(401).send("not allowed");
}
note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
res.json({note});

} catch (error) {
    console.error(error.message);
    res.status(500).send("internal error occured");
}
}
)

//Route 4:delete an existing note: DELETE "/api/notes/deletenote".  require Auth
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    try {

    //find the note to be deleted and delete it;
    let note=await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("note not found")};
    
    //check whether the requesting user is the owner of the note being deleted;
    if(note.user.toString()!==req.user.id)
    {
        return res.status(401).send("not allowed");
    }
    note=await Notes.findByIdAndDelete(req.params.id)
    res.json({"success":"Note has been deleted",note:note});
    
} catch (error) {
       console.error(error.message);
    res.status(500).send("internal error occured"); 
}
    }
    )


module.exports=router;