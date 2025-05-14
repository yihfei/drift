"use client"

import { useActionState } from "react";
import { login } from '../../actions/userController';

export default function Page() {

    const [formState, formAction] = useActionState(login, {})

    
    return (
        <>
            <h2 className="text-center text-2xl text-gray-500 mb-5">login</h2>
            <form action={formAction} className="max-w-xs mx-auto">
                <div className="mb-3">
                    <input name="username" autoComplete="off" type="text" placeholder="Username" className="input" />
                </div>
                <div className="mb-3">
                    <input name="password" autoComplete="off" type="password" placeholder="password" className="input" />
                    
                </div>
                {formState.message && (
                    <div role="alert" className="alert alert-error my-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formState.message}</span>
                    </div>
                )}
                <button type="submit"className="btn">Log In</button>
            </form>
        </>
    )
}