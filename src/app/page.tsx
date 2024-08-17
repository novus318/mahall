'use client'
import Sidebar from "@/components/Sidebar";
import { withAuth } from "@/components/withAuth";

function Home() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/6">
        <Sidebar />
      </div>
      <div className="w-full md:w-5/6 p-4">
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        </div>
      </div>
    </div>
  );
}

export default withAuth(Home);
