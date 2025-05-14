"use client"

import { useActionState } from "react"
import { createLog, editLog } from "../actions/logController"

export default function LogForm(props) {
    let actualAction

    if (props.action === "create") {
        actualAction = createLog
    }

    if (props.action === "edit") {
        actualAction = editLog
    }

    const [formState, formAction] = useActionState(actualAction, {})

    return (
        <form action={formAction} className="max-w-2xl mx-auto">
                <div>
                    <div className="mb-3">
                        <input name="title" 
                        defaultValue={props.log?.title}autoComplete="off" type="text" placeholder="title" className="input w-full" />
                    </div>
                    <div className="mb-3">
                        <textarea name="log" className="textarea w-full h-60" defaultValue={props.log?.log} placeholder="your log"></textarea>
                    </div>
                    {formState.message && (
                        <div role="alert" className="alert alert-error my-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{formState.message}</span>
                        </div>
                    )}
                </div>
                <input type="hidden" name="LogId" defaultValue={props.log?.id}/>
                <button type="submit" className="btn text-white" style={{ backgroundColor: '#6A7B3E' }}>submit</button>
            </form>
    )
}