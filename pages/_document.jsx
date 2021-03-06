import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en" className="text-coolGray-200 leading-tight">
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@200&amp;display=swap" rel="stylesheet" />
        </Head>
        <body className="min-h-screen bg-coolGray-900">
          <Main />
          <NextScript />
        </body>
        <style jsx global>{`
        ::selection {
          background: rgba(4, 160, 157); /* WebKit/Blink Browsers */
          color: white;
        }
        ::-moz-selection {
          background: rgba(4, 160, 157); /* Gecko Browsers */
          color: white;
        }
      `}</style>
      </Html>
    )
  }
}

export default MyDocument