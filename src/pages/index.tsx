import Head from "next/head";
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {useRouter} from "next/router";
import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "~/server/auth";

export default function Home({user}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {data: session, status} = useSession()
    const router = useRouter()

    return (
        <>
            <Head>
                <title>Manage your Aromiii account</title>
            </Head>
            <div className="bg-color w-screen h-screen flex place-content-center place-items-center">
                <div className="p-2 rounded-lg base-color flex flex-col place-items-center">
                    <h1 className="text-2xl font-bold">Hello {session?.user?.displayName}</h1>
                    <div className="flex gap-3 mt-3">
                        <Link href="/edit" className="liveal-button bg-blue-600">Edit profile</Link>
                        <button onClick={() => signOut()} className="liveal-button">Sign out</button>
                    </div>
                </div>
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

    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: true
            }
        }
    }

    return {
        props: {
            user: {
                firstName: session?.user.firstName,
                lastName: session?.user.lastName,
                username: session?.user.username,
                displayName: session?.user.displayName
            }
        }
    }
}
