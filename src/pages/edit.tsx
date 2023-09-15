import Head from "next/head";
import React, {useState} from "react";
import {getServerSession} from "next-auth";
import {authOptions} from "~/server/auth";
import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import Link from "next/link";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";

export default function Edit({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { update } = useSession()
  const router = useRouter()
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [username, setUsername] = useState(user.username);

  const editUser = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (!confirm("Do you want to update your account")) {
      return
    }

    const response = await fetch("/api/user", {
      method: "PUT",
      credentials: "include",
      headers:{'content-type': 'application/json'},
      body: JSON.stringify({
        displayName: displayName,
        username: username,
        firstName: firstName,
        lastName: lastName,
      })
    });

    if (response.status > 299) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const body: {message: string} = await response.json();
      alert(body.message)
    }

    if (response.status < 299) {
      await update({
        displayName: displayName,
        username: username,
        firstName: firstName,
        lastName: lastName,
      })
      void router.push("/")
    }
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
                     onChange={event => setFirstName(event.target.value)} defaultValue={firstName}/>
              <input placeholder="Last name" className="w-full"
                     onChange={event => setLastName(event.target.value)} defaultValue={lastName}/>
            </div>
            <div className="dark:bg-gray-800 bg-gray-200 h-0.5 rounded-full"/>
            <div className="gap-3 flex">
              <input placeholder="Display name" className="w-full"
                     onChange={event => setDisplayName(event.target.value)} defaultValue={displayName}/>
              <input placeholder="Username" className="w-full"
                     onChange={event => setUsername(event.target.value)} defaultValue={username}/>
            </div>
            <div className="dark:bg-gray-800 bg-gray-200 h-0.5 rounded-full"/>
            <div className="w-full flex gap-3">
              <Link className="liveal-button text-center w-full bg-blue-600" href="/">Close</Link>
              <button className="liveal-button w-full" onClick={event => void editUser(event)}>Save & Close</button>
            </div>
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