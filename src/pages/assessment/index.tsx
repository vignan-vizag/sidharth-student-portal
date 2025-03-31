import { API_BASE_URL } from "@/utils";
import React, { useEffect, useState } from "react";
import { Test } from "@/types";
import Link from "next/link";
// import sampleTests from "@/lib/sample-tests.json";

const CategoryWiseTests: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/tests/all`);
        if (!res.ok) throw new Error("Failed to fetch tests");
        const data: Test[] = await res.json();
        setTests(data);
      } catch (err) {
        // setTests(sampleTests);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);  

  if (loading)
    return <p className="mt-[15%] text-center text-gray-500 text-lg h-screen">Loading tests...</p>;

  if (error)
    return <p className="mt-[15%] text-center text-red-500 text-lg h-screen">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 lg:px-0 min-h-screen">
      <h1 className="text-xl font-semibold font-mono uppercase  mb-4 text-gray-800">Available Tests ({tests.length})</h1>

      {tests.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No tests available</p>
      ) : (
        <div className="grid grid-cols-4 xl:grid-cols-3 md:!grid-cols-1 gap-5">
          {tests.map((test) => (
            // <div key={test._id} className="bg-white border-[2px] w-72 border-neutral-200 p-4 hover:border-blue-600 transition-all duration-200">
            <div key={test._id} className="p-4 py-6 bg-white border-[2px] h-80 w-auto ">
              {/* <Link href={`/assessment/${test._id}`} key={test._id}> */}

              <div className="flex flex-col justify-between h-full">
                <div className="space-y-2">
                  <h2 className="text-base text-gray-900 font-mono font-semibold">{test.testName}</h2>
                  <div className="text-sm flex flex-col gap-0.5">
                    <div>Public</div>
                    <div>Active: <span></span>2 Days</div>
                    <div>
                      {/* <div>Category</div> */}
                      <ul className="mt-1 flex flex-wrap gap-1">
                        {test.categories.map((category) => (
                          <li key={category._id} className="px-4 py-0.5 w-fit text-sm border rounded-sm border-purple-700/40 bg-purple-500/20 font-mono">
                            {category.categoryName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <Link href={`/assessment/${test._id}`} className="p-2 px-4 border border-blue-600 hover:border-blue-700 bg-blue-500/30 text-blue-800 hover:text-blue-900 hover:bg-blue-500/40 transition-all duration-100 text-sm text-center font-medium tracking-wide">Take Assessment</Link>
              </div>

              {/* <ul className="mt-4 flex items-center gap-3 flex-wrap">
                  {test.categories.map((category) => (
                    <li key={category._id} className="p-3 w-fit lg:w-full border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                      <Link
                        href={`/assessment/${test._id}/?category=${category.categoryName.toLowerCase()}`}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        {category.categoryName} Assessment
                      </Link>
                    </li>
                  ))}
                </ul> */}
              {/* </Link> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryWiseTests;
