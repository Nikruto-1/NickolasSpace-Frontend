import BusinessAutomation from "./components/BusinessAutomation.jsx";
import FinalCTA from "./components/FinalCTA.jsx";
import Footer from "./components/Footer.jsx";
import FounderSection from "./components/FounderSection.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import HowWeWork from "./components/HowWeWork.jsx";
import IntroStatement from "./components/IntroStatement.jsx";
import SelectedWork from "./components/SelectedWork.jsx";
import Services from "./components/Services.jsx";
import { ContactModalProvider } from "./components/contact/ContactModalContext.jsx";

export default function App() {
  return (
    <ContactModalProvider>
      <Header />
      <main>
        <Hero />
        <IntroStatement />
        <Services />
        <SelectedWork />
        <BusinessAutomation />
        <HowWeWork />
        <FounderSection />
        <FinalCTA />
      </main>
      <Footer />
    </ContactModalProvider>
  );
}
