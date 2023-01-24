// app.get("/currentUser",(req,res)=>{
//   res.json(req.session)
// })

// const isLoginGuard = (req:Request,res:Response,next:NextFunction)=>{
//   if (req.session.userId){
    
//     next();
//   }else{
//     res.redirect("/login.html");
//   }
// };

// app.use(
//   isLoginGuard,
//   express.static("protected")
// );
