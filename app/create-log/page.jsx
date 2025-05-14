import { getUserFromCookie } from "../../lib/getUser";
import LogForm from "../../components/LogForm";
import { redirect } from "next/navigation";

export default async function Page() {
    const user = await getUserFromCookie()
    if (!user) {
        return redirect("/")
    }


    return (
        <>
            
            <h2 className="text-center text-2xl text-gray-500 mb-5">Create Log</h2>
            <LogForm action="create" />
        </>
    )
}