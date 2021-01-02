import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <footer className='flex justify-center mt-10 mb-10'>
        <a
          href="https://tomchristian.co.uk"
          target="_blank"
          rel="noopener"
          className='text-sm transition-colors text-coolGray-500 hover:text-coolGray-300'
        >
          Project by Tom Christian
        </a>
      </footer>
    </>
  )
}

export default MyApp