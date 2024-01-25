import type { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import Link from "next/link";
import { getServerSideProps } from "~/utils/serverProps";

export { getServerSideProps };

function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(props.apiURL);

  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center text-center justify-center gap-2 h-full">
        <Image src="/favicon.ico" alt="Logo" width={150} height={150} />
        <h1 className="text-4xl font-bold">Messer</h1>
        <p className="text-sm text-gray-400">Capture Truth Quickly</p>
        <div className="flex flex-col gap-4 mt-6">
          <Button className="flex gap-4 rounded-xl justify-between px-7 py-3 text-lg h-fit" asChild>
            <Link href={{ pathname: "/generate" }}>
              <div className="bg-white rounded-full p-1">
                <Plus className="stroke-primary" width={16} height={16} />
              </div>
              <span className="m-auto">
                Generate New Video
              </span>
            </Link>
          </Button>
          <Button className="flex gap-4 rounded-xl justify-between px-7 py-3 text-lg h-fit" asChild>
            <Link href={{ pathname: "/projects" }}>
              <div className="bg-white rounded-full p-1">
                <Pencil className="stroke-primary" width={16} height={16} />
              </div>
              <span className="m-auto">
                Manage Old Projects
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;

