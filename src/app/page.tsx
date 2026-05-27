import Header from '@/components/Header/Header'
import Hero from '@/components/Hero/Hero'
import About from '@/components/About/About'
import Products from '@/components/Products/Products'
import Benefits from '@/components/Benefits/Benefits'
import { B2BSection } from '@/components/B2B/B2BSection'
import Address from '@/components/Address/Address'
import Contact from '@/components/Contact/Contact'
import Footer from '@/components/Footer/Footer'
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton/WhatsAppFloatingButton'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <B2BSection />
        <About />
        <Products />
        <Benefits />
        <Address />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  )
}
