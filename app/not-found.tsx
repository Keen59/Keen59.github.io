import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-wood">404</p>
      <h1 className="mt-2 font-serif text-5xl">Bu sayfa atölyede yok.</h1>
      <Link href="/" className="btn btn-primary mt-6 w-fit">
        Ana sayfa
      </Link>
    </div>
  );
}
