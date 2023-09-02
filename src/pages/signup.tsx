import Head from "next/head";
import {useState} from "react";
import {signIn} from "next-auth/react";

export default function Signup() {
    const [name, setName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");

    const createUser = async (event: any) => {
        event.preventDefault()

        await signIn("credentials", {
            redirect: true, email: email, password: password, name: name, displayName: displayName, username: username
        })
    }

    return (
        <>
            <Head>
                <title>Create Aromiii account</title>
            </Head>
            <div className="bg-gray-200 dark:bg-gray-700 w-screen h-screen flex place-content-center place-items-center">
                <main className="text-black dark:text-white bg-white dark:bg-gray-900 gap-3 flex flex-col rounded-lg p-10 place-items-center max-w-[90%] min-w-[300px]">
                    <h1 className="text-center text-2xl font-bold">Create account</h1>
                    <form className="flex flex-col gap-3 w-full">
                        <input placeholder="Your name" className="w-full"
                               onChange={event => setName(event.target.value)}/>
                        <div className="dark:bg-gray-800 bg-gray-200 h-0.5 rounded-full"/>
                        <div className="gap-3 flex">
                            <input placeholder="Display name" className="w-full"
                                   onChange={event => setDisplayName(event.target.value)}/>
                            <input placeholder="Username" className="w-full"
                                   onChange={event => setUsername(event.target.value)}/>
                        </div>
                        <div className="dark:bg-gray-800 bg-gray-200 h-0.5 rounded-full"/>
                        <input placeholder="Email" type="email" onChange={event => setEmail(event.target.value)}/>
                        <input placeholder="Password" type="password"
                               onChange={event => setPassword(event.target.value)}/>
                        <input placeholder="Password again" type="password"
                               onChange={event => setPasswordAgain(event.target.value)}/>
                        <div className="dark:bg-gray-800 bg-gray-200 h-0.5 rounded-full"/>
                        <button className="liveal-button" onClick={event => void createUser(event)}>Create account</button>
                    </form>
                </main>
            </div>
        </>
    );
}
