// 'use client'
// import React from "react";
// import CourseDetailsPage from "../../components/Course/CourseDetailsPage";


// const Page = ({params}:any) => {
//     return (
//         <div>
//             <CourseDetailsPage id={params.id} />
//         </div>
//     )
// }

// export default Page;
import React, { Suspense } from 'react';
import CourseDetailsPage from '../../components/Course/CourseDetailsPage';

const Page = ({ params }: any) => {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <CourseDetailsPage id={params.id} />
            </Suspense>
        </div>
    );
};

export default Page;
