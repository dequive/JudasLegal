import Head from 'next/head';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import TooltipDemo from '../components/Demo/TooltipDemo';

export default function DemoTooltips() {
  return (
    <>
      <Head>
        <title>Demo Tooltips - Judas Assistente Jurídico</title>
        <meta name="description" content="Demonstração dos tooltips jurídicos contextuais" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <main className="flex-1 py-8">
          <TooltipDemo />
        </main>
        
        <Footer />
      </div>
    </>
  );
}