// src/components/layout/Sidebar.tsx
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">ERP Perú</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-700">
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/dashboard/asientos" className="block p-2 rounded hover:bg-gray-700">
              Asientos Contables
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/dashboard/terceros" className="block p-2 rounded hover:bg-gray-700">
              Terceros
            </Link>
          </li>
          {/* Añadiremos más enlaces aquí en el futuro */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;