import Link from "next/link";

interface BreadcrumbProps {
  pageName: string;
}

const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <div className="mb-3 flex flex-col gap-3">

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/dashboard/">
              Dashboard /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>

    </div>
  );
};

export default Breadcrumb;
