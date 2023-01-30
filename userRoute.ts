app.get("/currentUser",(req,res)=>{
  res.json(req.session)
})


