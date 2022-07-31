/* pages/_app.js */
import "../styles/globals.css";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <div className="#">
      <nav className="border-b p-6 bg-black text-white">
        <p className="text-4xl font-bold">NFT Market</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 ">Home</a>
          </Link>
          <Link href="/register">
            <a className="mr-6">Register</a>
          </Link>
        </div>
      </nav>
      <Component className="bg-black" {...pageProps} />
    </div>
  );
}

export default MyApp;
