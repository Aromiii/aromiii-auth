import Head from "next/head";
import React, {useState} from "react";
import {signIn} from "next-auth/react";
import {useRouter} from "next/router";
import {GetServerSidePropsContext} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "~/server/auth";
import Link from "next/link";

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    void signIn("signIn", {
      email: email, password: password
    }).then(() => {
      void router.push("/")
    })
  }

  return (
    <>
      <Head>
        <title>Log in to Aromiii account</title>
      </Head>
      <div
        className="bg-gray-200 dark:bg-gray-700 w-screen h-screen flex place-content-center place-items-center">
        <main
          className="text-black dark:text-white bg-white dark:bg-gray-900 gap-3 flex flex-col rounded-lg p-10 place-items-center max-w-[90%] min-w-[300px]">
          <h1 className="text-center text-2xl font-bold">Log in</h1>
          <form className="flex flex-col gap-3 w-full">
            <input placeholder="Email" type="email" onChange={event => setEmail(event.target.value)}/>
            <input placeholder="Password" type="password"
                   onChange={event => setPassword(event.target.value)}/>
            <div className="dark:bg-gray-800 bg-gray-200 h-0.5 rounded-full"/>
            <button className="liveal-button" onClick={(event) => login(event)}>Log in</button>
          </form>
          <Link className="liveal-link" href="/signup">Create account</Link>
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