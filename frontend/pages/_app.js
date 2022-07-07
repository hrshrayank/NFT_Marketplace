/* pages/_app.js */
import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div className='bg-black text-white'>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">NFT Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 ">
              Home
            </a>
          </Link>
          <Link href="/create">
            <a className="mr-6">
              Sell NFT
            </a>
          </Link>
          <Link href="/my-nft">
            <a className="mr-6">
              My NFTs
            </a>
          </Link>
          <Link href="/dashboard">
            <a className="mr-6">
              Dashboard
            </a>
          </Link>
        </div>
      </nav>
      <Component className="bg-black" {...pageProps} />
    </div>
  )
}

export default MyApp