import Head from "next/head";

export default function Login() {
    return (
        <>
            <Head>
                <title>Create Aromiii account</title>
            </Head>
            <div className="bg-gray-200 dark:bg-gray-700 w-screen h-screen flex place-content-center place-items-center">
                <main className="text-black dark:text-white bg-white dark:bg-gray-900 gap-3 flex flex-col rounded-lg p-10 place-items-center max-w-[90%] min-w-[300px]">
                    <h1 className="text-center text-2xl font-bold">Log in</h1>
                    <form className="flex flex-col gap-3 w-full">
                        <input placeholder="Email" type="email"/>
                        <input placeholder="Password" type="password"/>
                        <div className="dark:bg-gray-800 bg-gray-200 h-0.5 rounded-full"/>
                        <button className="liveal-button">Log in</button>
                    </form>
                </main>
            </div>
        </>
    );
}
