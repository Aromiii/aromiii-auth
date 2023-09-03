import Head from "next/head";
import {useSession} from "next-auth/react";

export default function Home() {
    const { data: session } = useSession()
    console.log(session)

    return (
    <>
      <Head>
        <title>Manage your Aromiii account</title>
      </Head>
      <div className="bg-gray-200 dark:bg-gray-700 w-screen h-screen flex place-content-center place-items-center">
          <h1 className="text-2xl text-white">User: {session?.user.toString()}</h1>
      </div>
    </>
  );
}
