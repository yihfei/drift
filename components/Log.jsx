import Link from "next/link"
import { deleteLog } from "../actions/logController";

export default function Log({ log }) {
    return (
        <div className="card bg-base-100 shadow-sm card-s mb-5">
            <div className="card-body">
                <h2 className="card-title text-2xl text-gray-500 mb-5">{log.title}</h2>
                <p className="text-gray-700 mb-5">{log.log}</p>
                {/* <p className="text-gray-500 mb-5">Created at: {new Date(log.createdAt).toLocaleString()}</p>
                <p className="text-gray-500 mb-5">Updated at: {new Date(log.updatedAt).toLocaleString()}</p> */}
                <div className="justify-end card-actions">
                    <button className="btn">
                        <Link href={`/edit-log/${log._id}`}>Edit</Link>
                    </button>
                    <form action={deleteLog}>
                        <input type="hidden" name="LogId" defaultValue={log._id}/>
                        <button className="btn">Delete</button>
                    </form>
                </div>
            </div>
            
        </div>
    )

}