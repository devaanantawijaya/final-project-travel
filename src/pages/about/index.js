import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const AboutPage = () => {
  return (
    <div>
      <Navbar />
      <section class=" text-white pt-28">
        <div class="container mx-auto px-8">
          <div class="text-gray-800 rounded-lg shadow-2xl p-10 text-center bg-slate-100 border-2 border-orange-400">
            <h2 class="text-4xl font-bold text-orange-500 mb-6">About Us</h2>
            <p class="text-lg mb-6">
              At our travel company, we don’t just plan trips—we craft
              unforgettable experiences. Whether you are chasing sun-kissed
              beaches, breathtaking landscapes, or vibrant cityscapes, we bring
              your travel dreams to life with unparalleled service and attention
              to detail.
            </p>
            <p class="text-lg mb-6">
              Our journey began with a deep passion for exploration and a desire
              to make travel seamless and extraordinary. From solo travelers
              seeking soul-searching adventures to families yearning for perfect
              getaways, we cater to every wanderer with curated experiences that
              inspire and excite.
            </p>
            <p class="text-lg mb-6">
              What sets us apart? It’s our commitment to personalization. We
              believe every traveler deserves a unique journey, tailored to
              their interests and preferences. Our dedicated team of travel
              experts collaborates with top-tier partners worldwide to offer
              exclusive itineraries, handpicked accommodations, and immersive
              local experiences that go beyond the ordinary.
            </p>
            <p class="text-lg mb-6">
              With us, travel isn’t just about reaching a destination—it’s about
              embracing the journey. Imagine waking up to the sound of ocean
              waves, exploring hidden gems with expert guides, and indulging in
              culinary delights that tantalize your taste buds. We take care of
              the details so you can immerse yourself in each moment without
              worry.
            </p>
            <p class="text-lg mb-6">
              Our mission is to connect people with places, cultures, and
              experiences that leave a lasting impact. With years of expertise,
              cutting-edge technology, and a passion for adventure, we ensure
              that every journey is as smooth as it is exciting. From booking
              your flights to arranging private tours, we make travel effortless
              and extraordinary.
            </p>
            <p class="text-lg font-semibold text-orange-500">
              The world is waiting. Let’s turn your travel dreams into
              reality—one adventure at a time.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
