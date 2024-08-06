// "use client";
// import DashboardHero from "@/app/components/Admin/DashboardHero";
// import AdminProtected from "@/app/hooks/adminProtected";
// import Heading from "@/app/utils/Heading";
// import React from "react";
// import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
// import AllCourses from "../../components/Admin/Course/AllCourses";

// type Props = {};

// const page = (props: Props) => {
//   return (
//     <div>
//       <AdminProtected>
//         <Heading
//           title="SolviT - Admin"
//           description="SolviT is a platform for students to learn and get help from teachers"
//           keywords="Programming,MERN,Redux,Machine Learning"
//         />
//         <div className="flex h-screen">
//           <div className="1500px:w-[16%] w-1/5">
//             <AdminSidebar />
//           </div>
//           <div className="w-[85%]">
//             <DashboardHero />
//             <AllCourses />
//           </div>
//         </div>
//       </AdminProtected>
//     </div>
//   );
// };

// export default page;
"use client"; // Ensure this is a client component

import React, { Suspense } from "react";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import AllCourses from "../../components/Admin/Course/AllCourses";

type Props = {};

const Page = (props: Props) => {
  return (
    <AdminProtected>
      <Suspense fallback={<div>Loading...</div>}>
        <Heading
          title="SolviT - Admin"
          description="SolviT is a platform for students to learn and get help from teachers"
          keywords="Programming,MERN,Redux,Machine Learning"
        />
        <div className="flex h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero />
            <AllCourses />
          </div>
        </div>
      </Suspense>
    </AdminProtected>
  );
};

export default Page;
