import { getCollection } from "../../../lib/db"
import LogForm from "../../../components/LogForm";
import { ObjectId } from "mongodb"
import { getUserFromCookie } from "../../../lib/getUser";
import { redirect } from "next/dist/server/api-utils";

async function getDoc(id) {
    const logsCollection = await getCollection("logs")
    const doc = await logsCollection.findOne({ _id: ObjectId.createFromHexString(id) })
    
    return {
        id: doc._id.toString(),
        title: doc.title,
        log: doc.log,
        author: doc.author?.toString()
    }

}

export default async function Page({ params }) {
    params = await params
    const doc = await getDoc(params.id)
    const user = await getUserFromCookie()

    if (user.userId != doc.author) {
        return redirect("/")
    }

    return (
        <div>
            <h2 className="text-center text-4xl text-gray-600 mb-10">Edit Post</h2>
            <LogForm log={doc} action="edit" />
        </div>
    )
}