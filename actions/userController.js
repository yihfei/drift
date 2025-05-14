"use server"

import { getCollection } from "../lib/db.js"
import bcrypt from "bcrypt"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
import {redirect} from "next/navigation"


function isAlphaNumeric(str) {
    return /^[a-z0-9]+$/i.test(str);
}

export const logout = async function() {
    const cookieStore = await cookies();   
    cookieStore.delete("drift");
    return redirect("/");
}

export const login = async function(prevState, formData) {
    const failObject = { 
        success: false, 
        message: "Invalid username or password"
    }

    const ourUser = {
        username: formData.get("username"),
        password: formData.get("password"),
    }

    // mongodb security validation
    if (typeof ourUser.username != "string") ourUser.username = ""
    if (typeof ourUser.password != "string") ourUser.username = ""

    const collection = await getCollection("users")
    const user = await collection.findOne({username: ourUser.username})

    if (!user) {
        return failObject
    }

    const isMatch = bcrypt.compareSync(ourUser.password, user.password)

    if (!isMatch) {
        return failObject
    }

    // create jwt value
    const ourTokenValue = jwt.sign({userId: user._id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, process.env.JWTSECRET)
    // log user in by giving them cookie
    const cookieStore = await cookies();
    cookieStore.set("drift", ourTokenValue, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        secure: true
    })

    console.log("login success")

    return redirect("/")
}

export const register = async function(prevState, formData) {
    const errors = {}

    const ourUser = {
        username: formData.get("username"),
        password: formData.get("password"),
    }

    // mongodb security validation
    if (typeof ourUser.username != "string") ourUser.username = ""
    if (typeof ourUser.password != "string") ourUser.username = ""

    ourUser.username = ourUser.username.trim()
    ourUser.password = ourUser.password.trim()

    if (ourUser.username.length < 3) {
        errors.username = "Username must be at least 3 characters"
    }
    if (ourUser.username.length > 20) {
        errors.username = "Username must be less than 20 characters"
    }
    if (!isAlphaNumeric(ourUser.username)) {
        errors.username = "Username can only contain letters and numbers"
    }
    if (ourUser.username == "") {
        errors.username = "Username cannot be blank"
    }

    // check if user already exists
    const usersCollection = await getCollection("users")
    const isExistingUser = await usersCollection.findOne({username: ourUser.username})
    if (isExistingUser) {
        errors.username = "Username already exists"
    }

    if (ourUser.password.length < 8) {
        errors.password = "password must be at least 8 characters"
    }
    if (ourUser.password.length > 20) {
        errors.password = "password must be less than 20 characters"
    }
    if (ourUser.password == "") {
        errors.password = "password cannot be blank"
    }

    if (errors.username || errors.password) {
        return { 
            errors: errors,
            success: false, 
        }
    }

    const salt = bcrypt.genSaltSync(10)
    ourUser.password = bcrypt.hashSync(ourUser.password, salt)

    // storing a new user in the database
    const newUser = await usersCollection.insertOne(ourUser)
    const userId = newUser.insertedId.toString()


    // create a JWT token
    const ourTokenValue = jwt.sign({userId: userId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, process.env.JWTSECRET)
    // log user in by giving them cookie
    const cookieStore = await cookies();
    cookieStore.set("drift", ourTokenValue, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        secure: true
    })

    return {
        success: true
    }

}