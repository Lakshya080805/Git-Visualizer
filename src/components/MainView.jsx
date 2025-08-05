// // export default function MainView() {
// //   return (
// //     <div className="flex-1 bg-gray-100 p-6 overflow-auto">
// //       <h2 className="text-2xl font-semibold mb-4">Commit Visualization</h2>
// //       <div className="border border-gray-300 rounded-lg h-[80vh] flex items-center justify-center">
// //         <p className="text-gray-500">Visualization will appear here</p>
// //       </div>
// //     </div>
// //   );
// // }
// //--------------------------------------------------------------------------------

// import { dummyCommits } from "../data/dummyCommits";

// export default function MainView() {
//   return (
//     <div className="flex-1 bg-gray-100 p-6 overflow-auto">
//       <h2 className="text-2xl font-semibold mb-4">Commit Visualization</h2>
//       <ul className="space-y-2">
//         {dummyCommits.map((c) => (
//           <li key={c.hash} className="bg-white p-3 rounded shadow">
//             <p className="font-bold">{c.message}</p>
//             <p className="text-gray-600 text-sm">
//               {c.author} • {c.date} • {c.hash}
//             </p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
//-------------------------------------------------------------------------------------------------

import { dummyCommits } from "../data/dummyCommits";
import BranchTree from "./BranchTree";

export default function MainView() {
  return (
    <div className="flex-1 bg-gray-100 p-6 overflow-auto">
      <h2 className="text-2xl font-semibold mb-4">Commit Visualization</h2>

      {/* Step 1: Show Branch Tree */}
      <div className="h-96 mb-8">
        <BranchTree />
      </div>

      {/* Step 2: Commit List */}
      <ul className="space-y-2">
        {dummyCommits.map((c) => (
          <li key={c.hash} className="bg-white p-3 rounded shadow">
            <p className="font-bold">{c.message}</p>
            <p className="text-gray-600 text-sm">
              {c.author} • {c.date} • {c.hash}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

