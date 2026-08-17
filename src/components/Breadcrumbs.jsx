import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items }) {
  if (!items?.length) return null;
  return (
    <nav aria-label="Breadcrumb" className="container-page pt-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-mist-500">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {last ? (
                <span className="font-medium text-mist-700">{item.name}</span>
              ) : (
                <Link to={item.path} className="hover:text-mist-900 hover:underline">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
