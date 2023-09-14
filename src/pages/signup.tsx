import Head from "next/head";
import {useState} from "react";
import {signIn} from "next-auth/react";
import {GetServerSidePropsContext} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "~/server/auth";
import {useRouter} from "next/router";

export default function Signup() {
    const router = useRouter()
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");

    const createUser = async (event: any) => {
        event.preventDefault()

        if (password != passwordAgain) {
            alert("Password and password confirmation doesn't match")
            return;
        }

        await signIn("signUp", {
            email: email, password: password, displayName: displayName, username: username, firstName: firstName, lastName: lastName
        }).then(() => {
            router.push("/")
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
                        <div className="gap-3 flex">
                            <input placeholder="First name" className="w-full"
                                   onChange={event => setFirstName(event.target.value)}/>
                            <input placeholder="Last name" className="w-full"
                                   onChange={event => setLastName(event.target.value)}/>
                        </div>
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(
        context.req,
        context.res,
        authOptions
    )

    if (session) {
        return {
            redirect: {
                destination: "/",
                permanent: true
            }
        }
    }

    return {
        props: {}
    }
}
