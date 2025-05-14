import { ObjectId } from "mongodb"
import { getCollection } from "../lib/db"
import Log from "./Log"

async function getLogs(id) {
    const collection = await getCollection("logs")
    const results = await collection.find({ author: ObjectId.createFromHexString(id) }).sort({_id: -1}).toArray()
 
    return results.map(log => ({
        ...log,
        _id: log._id.toString(),
        author: log.author.toString(),
    }))
    
}

export default async function Dashboard(props) {
    const logs = await getLogs(props.user.userId)
    return (
        <div>
            <h2 className="text-center text-2xl text-gray-600 mb-5">Your Logs</h2>
            {logs.map((log, index) => <Log key={log._id || index} log={log} />)}
        </div>
    )
}