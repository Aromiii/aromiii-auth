import Head from "next/head";

export default function Signup() {
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
                            <input placeholder="First name" className="w-full"/>
                            <input placeholder="Last name" className="w-full"/>
                        </div>
                        <div className="dark:bg-gray-800 bg-gray-200 h-0.5 rounded-full"/>
                        <div className="gap-3 flex">
                            <input placeholder="Display name" className="w-full"/>
                            <input placeholder="Username" className="w-full"/>
                        </div>
                        <div className="dark:bg-gray-800 bg-gray-200 h-0.5 rounded-full"/>
                        <input placeholder="Email" type="email"/>
                        <input placeholder="Password" type="password"/>
                        <input placeholder="Password again" type="password"/>
                        <div className="dark:bg-gray-800 bg-gray-200 h-0.5 rounded-full"/>
                        <button className="liveal-button">Create account</button>
                    </form>
                </main>
            </div>
        </>
    );
}
