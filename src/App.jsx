import BusinessAutomation from "./components/BusinessAutomation.jsx";
import BusinessChallenges from "./components/BusinessChallenges.jsx";
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
import MotionProvider from "./components/shared/MotionProvider.jsx";
import ProjectPage from "./components/ProjectPage.jsx";

export default function App({ projectRoute = null }) {
  return (
    <MotionProvider><ContactModalProvider>
      <Header projectRoute={projectRoute} />
      <main id="main-content" tabIndex={-1}>
        {projectRoute ? <ProjectPage route={projectRoute} /> : <>
        <Hero />
        <IntroStatement />
        <SelectedWork />
        <BusinessChallenges />
        <Services />
        <BusinessAutomation />
        <HowWeWork />
        <FounderSection />
        <FinalCTA />
        </>}
      </main>
      <Footer home={projectRoute ? "./" : ""} />
    </ContactModalProvider></MotionProvider>
  );
}
