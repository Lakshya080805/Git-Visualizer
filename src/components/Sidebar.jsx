export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white p-4">
      <h1 className="text-xl font-bold mb-4">Git Visualizer</h1>
      <ul>
        <li className="mb-2 hover:text-yellow-400 cursor-pointer">Branches</li>
        <li className="mb-2 hover:text-yellow-400 cursor-pointer">Commits</li>
        <li className="hover:text-yellow-400 cursor-pointer">Settings</li>
      </ul>
    </div>
  );
}
