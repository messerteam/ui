import { GetServerSideProps } from "next/types";
import { env } from "~/env.mjs";

export const getServerSideProps = (async () => {
    return {
        props: { apiURL: env.API_URL }
    }
}) satisfies GetServerSideProps<{ apiURL: string }>;