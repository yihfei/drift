import Link from 'next/link';
import { getUserFromCookie } from '../lib/getUser';
import { logout } from '../actions/userController';

export default async function Header() {
    const user = await getUserFromCookie()

    return (
        <header className="bg-gray-100 shadow-sm " >
          <div className="navbar px-20">
            <div className="flex-1">
              <Link href="/" className="btn btn-ghost text-2xl text-[#6A7B3E]">Drift</Link>
            </div>
            <div className="flex-none">
              <ul className="menu menu-horizontal px-1">
                {!user && (
                    
                    <li>
                        <Link href="/login">Log In</Link>
                    </li>
                    
                )}
                {user && (
                    <>
                        <li className="mr-3">
                            <Link href="/create-log" className="btn text-white"
                            style={{ backgroundColor: '#6A7B3E' }}>
                                Create Log
                            </Link>
                        </li>
                        <form action={logout} className="btn text-gray-500">
                            <button>Log Out</button>
                        </form>
                    </>
                )}
              </ul>
            </div>
          </div>
        </header>
    )
}