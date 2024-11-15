import FetchWithProgress from "fetch-with-progress";
import React, { useEffect } from "react";

const Page = ({ children }) => {
    useEffect(() => {
        async () => {
            let response = await FetchWithProgress();
            /**
             * TODO: Handle response
             */
        };
        return () => {};
    }, []);
    return <>{children}</>;
};

export default Page;
