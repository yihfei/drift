"use server"

import { getUserFromCookie } from "../lib/getUser"
import { redirect } from "next/navigation"
import { ObjectId } from "mongodb"
import { getCollection } from "../lib/db"

async function sharedLogLogic(formData, user) {
    const errors = {}

    const ourLog = {
        title: formData.get("title"),
        log: formData.get("log"),
        author: ObjectId.createFromHexString(user.userId),
    }

    if (typeof ourLog.title != "string") {
        ourLog.title = ""
    }
    if (typeof ourLog.log != "string") {
        ourLog.log = ""
    }

    // trim whitespace
    ourLog.title = ourLog.title.trim()
    ourLog.log = ourLog.log.trim()

    if (ourLog.title.length < 1) {
        errors.title = "Title must not be empty"
    }
    
    return {
        errors: errors,
        log: ourLog,
    }
    
}

export const createLog = async function(prevState, formData) {
    const user = await getUserFromCookie()

    console.log("user =", user)

    if (!user) {
        return redirect("/")
    }

    console.log("user._id =", user._id, "typeof =", typeof user._id);
    const results = await sharedLogLogic(formData, user)

    if (results.errors.title) {
        return {
            error: results.errors.title,
        }
    }

    // save into db
    const logsCollection = await getCollection("logs")
    // change to ourlog?
    const newLog = await logsCollection.insertOne(results.log)
    return redirect("/")
}
 

export const editLog = async function(prevState, formData) {
    const user = await getUserFromCookie()

    if (!user) {
        return redirect("/")
    }

    const results = await sharedLogLogic(formData, user)

    if (results.errors.title) {
        return {
            error: results.errors.title,
        }
    }

    // update into db
    const logsCollection = await getCollection("logs")
    
    let logId = formData.get("LogId")
    if (typeof logId != "string") {
        logId = ""
    }

    console.log("logId =", logId, "typeof =", typeof logId);

    const logInQuestion = await logsCollection.findOne({ _id: ObjectId.createFromHexString(logId) })
    if (logInQuestion.author.toString() != user.userId) {
        return redirect("/")
    }

    await logsCollection.findOneAndUpdate(
        { _id: ObjectId.createFromHexString(logId) },
        { $set: results.log }
    )

    return redirect("/")
}

export const deleteLog = async function(formData) {
    const user = await getUserFromCookie()

    if (!user) {
        return redirect("/")
    }

    const logsCollection = await getCollection("logs")
    
    // check if user is the author
    let logId = formData.get("LogId")
    if (typeof logId != "string") {
        logId = ""
    }
    const logInQuestion = await logsCollection.findOne({ _id: ObjectId.createFromHexString(logId) })
    if (logInQuestion.author.toString() != user.userId) {
        return redirect("/")
    }

    await logsCollection.deleteOne(
        { _id: ObjectId.createFromHexString(logId) },
        
    )

    return redirect("/")

}