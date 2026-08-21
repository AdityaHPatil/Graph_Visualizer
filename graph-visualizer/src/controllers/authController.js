import pool from "../../db";
import bcrypt from "bcryptjs";
import { createToken, setAuthCookie } from "../utils/auth.js";
import jwt from "jsonwebtoken";


export async function signup(req,res){
try{
        
    
        const email=req.body.email;
        const password=req.body.password;

        if (typeof email !=='string' || typeof password !== 'string'){
            return res.status(400).json({error:"Email and password must be strings"})
        }



        const cleanedEmail=email.trim().toLowerCase();

        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanedEmail)){
            return res.status(400).json({
                message:"Please provide a valid email ID"
            });
        }
        

        if (!cleanedEmail){
            return res.status(400).json({message:"email is mandatory"});
        }

        if (!password){
            return res.status(400).json({message:"password is mandatory"});
        }

        if (password.length<6){
            return res.status(400).json({message:"password of 6+ characters"});
        }

        const passwordHash=await bcrypt.hash(password,10);

        const result=await pool.query(`INSERT INTO users (email,password_hash) VALUES ($1,$2) RETURNING id,email`,[cleanedEmail,passwordHash]);

        const user=result.rows[0];
        if (!user){
            return res.status(500).json({message:"User creation failed in database"})
        }

        const token=createToken(user);
        setAuthCookie(res,token);

        return res.status(201).json(user);
    }
    catch(error){
        if (error.code==="23505"){
            return res.status(409).json({message:"Email already exists"});
        }

        console.error(error);

        return res.status(500).json({message:"Signup failed"});
    }
}

export async function login(req,res){
    try {
        const email=req.body.email;
        const password=req.body.password;

        if (typeof email !=='string' || typeof password !== 'string'){
            return res.status(400).json({message:"Email and password must be strings"})
        }

        const cleanedEmail=email.trim().toLowerCase();

        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanedEmail)){
            return res.status(400).json({
                message:"Please provide a valid email ID"
            });
        }

        const result=await pool.query("SELECT * FROM users where email=$1",[cleanedEmail]);

        if (result.rows.length===0) {
            return res.status(401).json({message:"Invalid email"});
        }

        const nextResult=await bcrypt.compare(password,result.rows[0].password_hash);

        if (!nextResult){
            return res.status(401).json({message:"Invalid password"});
        }

        const publicUser={
            id:result.rows[0].id,
            email:result.rows[0].email,
        };

        const token=createToken(publicUser);

        setAuthCookie(res,token);

        return res.json(publicUser);

    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Login failed"});
    }
}

export async function me(req,res){
    // let token=null;

    // if (req.headers.cookie){
    //     const cookieArray=req.headers.cookie.split("; ");

    //     const tokenCookie=cookieArray.find((item) => {
    //         return item.startsWith("token=") });

    //     if (tokenCookie){
    //         token=tokenCookie.split("=")[1];
    //     }else{
    //         console.log("Token cookie not found in the list");      
    //     }
    // }else{
    //     console.log("No cookies found in headers");
    // }

    // if (!token){
    //     return res.status(401).json({message:"Not logged in"});
    // }

    try {
        const token=req.cookies?.token;

        if (!token){
            return res.status(401).json({ message: "Not logged in" });
        }

        const decoded=jwt.verify(token,import.meta.env.JWT_SECRET);

        const result=await pool.query("SELECT * from USERS WHERE id=$1",[decoded.id])


        if (result.rows.length===0){
            return res.status(401).json({message:"User not found"});
        }

        const user=result.rows[0];

        return res.status(200).json({id:user.id,email:user.email});

    } catch (error) {
        console.error("JWT verification error:",error);
        return res.status(401).json({message:"Inavlid or expired token"});
    }
}

export async function logout(req,res){
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });

    return res.status(200).json({message:"Logged out successfully"});
}