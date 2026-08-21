import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "../src/routes/authRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();


app.use(cookieParser());
app.use(express.json());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(authRouter);

// function createToken(user) {
//   return jwt.sign(
//     { id: user.id, 
//       email: user.email }, 
//     process.env.JWT_SECRET, 
//     { expiresIn: "7d"},
//   );
// }

// function setAuthCookie(res,token){
//     res.cookie("token",token,{
//         httpOnly:true,
//         sameSite:"lax",
//         secure:false,
//         maxAge:7*24*60*60*1000,
//     });
// }

// app.post("/api/auth/signup",async (req,res)=>{
//     try{
//         const email=req.body.email;
//         const password=req.body.password;

//         if (!email){
//             return res.status(400).json({message:"email is mandatory"});
//         }

//         if (!password){
//             return res.status(400).json({message:"password is mandatory"});
//         }

//         if (password.length<6){
//             return res.status(400).json({message:"password of 6+ characters"});
//         }

//         const passwordHash=await bcrypt.hash(password,10);

//         const result=await pool.query(`INSERT INTO users (email,password_hash) VALUES ($1,$2) RETURNING id,email`,[email.toLowerCase(),passwordHash]);

//         const user=result.rows[0];
//         const token=createToken(user);

//         setAuthCookie(res,token);

//         return res.status(201).json(user);
//     }
//     catch(error){
//         if (error.code==="23505"){
//             return res.status(409).json({message:"Email already exists"});
//         }

//         console.error(error);

//         return res.status(500).json({message:"Signup failed"});
//     }
// });

// app.post("/api/auth/login",async (req,res)=>{
//     try {
//         const email=req.body.email;
//         const password=req.body.id;

//         const result=await pool.query("SELECT * FROM users where email=$1",[email]);

//         if (result.rows.length===0) {
//             return res.status(401).json({message:"Invalid email"});
//         }

//         const nextResult=await bcrypt.compare(password,res.rows[0].passwordHash);

//         if (!nextResult){
//             return res.status(401).json({message:"Invalid password"});
//         }

//         const publicUser={
//             id:result.rows[0].id,
//             email:result.rows[0].email,
//         };

//         const token=createToken(publicUser);

//         setAuthCookie(res,token);

//         return res.json(publicUser);

//     } catch (error) {
//         console.error(error)
//         return res.status(500).json({message:"Login failed"});
//     }
// });

// app.get("/api/auth/me",(req,res) => { 
//     let token=null;

//     if (req.headers.cookie){
//         const cookieArray=req.headers.cookie.split("; ");

//         const tokenCookie=cookieArray.find((item) => {
//             return item.startsWith("token=") });

//         if (tokenCookie){
//             token=tokenCookie.split("=")[1];
//         }else{
//             console.log("Token cookie not found in the list");      
//         }
//     }else{
//         console.log("No cookies found in headers");
//     }

//     if (!token){
//         return res.status(401).json({message:"Not logged in"});
//     }

//     try {
//         const user=jwt.verify()
//     } catch (error) {
        
//     }
//  })

const PORT = import.meta.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});