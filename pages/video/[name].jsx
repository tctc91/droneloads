import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import smoothscroll from 'smoothscroll-polyfill'

import useDownloadPath from '../../hooks/useDownloadPath'
import { getVideos } from '../api/getVideos'
import { getCryptoWallet } from '../api/getCryptoWallet'

export default function Video({ video, donate }) {
  const videoPath = useDownloadPath(video.fileName)

  const date = new Date(video.timeCreated)

  const [meta, setMeta] = useState({
    date: date.toDateString(),
    location: video.location,
    height: null,
    width: null
  })

  const donateRef = useRef()
  const [donateActive, setDonateActive] = useState(false)

  useEffect(() => {
    smoothscroll.polyfill()
  }, [])

  useEffect(() => {
    if (donateActive) {
      donateRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [donateActive])

  const handleDownload = () => {
    setDonateActive(!donateActive)

    setTimeout(() => {
      location.href = videoPath
    }, 1500);
  }

  const handleMetadata = (evt) =>
    setMeta((current) => ({
      ...current,
      width: evt.target.videoWidth,
      height: evt.target.videoHeight
    }))

  const hasDimensions = meta.width && meta.height

  return (
    <div className="container px-4 pb-4 motion-safe:animate-fadeIn">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextSeo
        title={`${video.location} – Droneloads – Free drone videos`}
        description="HD drone videos. Free to download. No attribution needed."
        canonical={`https://droneloads.com/${video.name}`}
        openGraph={{
          url: 'https://droneloads.com',
          title: 'Droneloads – Free drone videos',
          description: 'HD drone videos. Free to download. No attribution needed.',
          videos: [
            {
              url: video.mediaLink,
              width: meta.width,
              height: meta.height,
              alt: `Filmed in ${meta.location} on ${meta.date} ${hasDimensions && `at ${meta.width} x ${meta.height} resolution`}`,
            }
          ],
          site_name: 'Droneloads',
        }}
        twitter={{
          handle: '@tomchristian91',
          site: 'https://droneloads.com',
          cardType: 'summary_large_image',
        }}
      />

      <div className='flex justify-center'>
        <div className='px-3 md:px-0 md:w-10/12'>
          {videoPath &&
            <video
              onLoadedMetadata={handleMetadata}
              controls
              className='shadow-2xl'
              preload='metadata'
              width='100%'
              height='100%'
            >
              <source src={videoPath} />
              Sorry, your browser doesn't support embedded videos.
            </video>
          }

          <div className='mt-5 mb-8 md:mt-8'>
            <h2 className='text-center font-normal text-coolGray-300 text-2xl mb-10'>
              Filmed in {meta.location} on {meta.date} {hasDimensions && `at ${meta.width} x ${meta.height} resolution`}
            </h2>
          </div>
        </div>
      </div>

      <div className='max-w-md mx-auto px-4'>
        <div className='flex justify-center text-center'>
          <div className='w-lg'>
            <button
              className='inline-flex w-full h-15 justify-center items-center px-6 py-3 text-white transition-colors duration-150 bg-green-default rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset focus:ring-opacity-90 hover:bg-green-light border border-transparent'
              onClick={handleDownload}
            >
              <span className='block mr-3'>Download free</span>
              <Image
                src={`/images/download.svg`}
                alt=''
                height='26'
                width='28'
              />
            </button>
          </div>
        </div>

        <div
          ref={donateRef}
          className={`block text-center justify-center mt-8 mb-10 transition duration-400 ease-in transform-gpu ${donateActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
        >
          <small className='block text-sm py-2 text-coolGray-500'>The download will begin shortly. <a className='transition-colors hover:text-coolGray-400 focus:text-coolGray-400 underline' href={videoPath} download={videoPath}>Manually download it here &rarr;</a></small>
          <h2 className='block text-xl pt-5 mb-3'>Want to support my work?</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <div
              className='w-full p-2 text-center bg-transparent border border-coolGray-800 rounded-md'
            >
              <div className='flex justify-center items-center'>
                <Image
                  src={`/images/bitcoin.svg`}
                  alt=''
                  height='28'
                  width='28'
                />
                <span className='block w-full p-2 select-all overflow-hidden overflow-ellipsis'>{donate.bitcoinWallet}</span>
              </div>

              <div className='flex justify-center mt-2'>
                <img src={donate.bitcoinQRCode} alt='Donate with Bitcoin' width='200' />
              </div>
            </div>
            <div
              className='w-full p-2 text-center bg-transparent border border-coolGray-800 rounded-md'
            >
              <div className='flex justify-center items-center'>
                <Image
                  src={`/images/eth.svg`}
                  alt=''
                  height='28'
                  width='28'
                />
                <span className='block w-full p-2 select-all overflow-hidden overflow-ellipsis'>{donate.ethWallet}</span>
              </div>
              <div className='flex justify-center mt-2'>
                <img src={donate.ethQRCode} alt='Donate with Ethereum' width='200' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  const videos = await getVideos()

  const paths = videos.map((video) => ({
    params: { name: video.name },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const videos = await getVideos()
  const donate = await getCryptoWallet()

  const video = videos.find((video) => video.name === params.name)

  return { props: { video, donate } }
}
