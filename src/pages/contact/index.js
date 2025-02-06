import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const ContactPage = () => {
  return (
    <div>
      <Navbar />
      <section class="pt-20">
        <div class="container mx-auto px-8 py-10">
          <div class="bg-gray-100 text-gray-800 rounded-lg shadow-xl p-10 text-center border-2 border-orange-400">
            <h2 class="text-4xl font-bold text-orange-500 mb-6">Contact Us</h2>
            <p class="text-lg mb-6">
              Have questions or need assistance with your travel plans? Get in
              touch with us through the following channels:
            </p>
            <div class="text-lg mb-6">
              <p>
                <strong>Email:</strong> support@travely.com
              </p>
              <p>
                <strong>Phone:</strong> +62 812 3456 7890
              </p>
              <p>
                <strong>Office:</strong> Jl. Sunset Road No. 45, Bali, Indonesia
              </p>
              <p>
                <strong>Branch Office:</strong> Jl. Thamrin No. 23, Jakarta,
                Indonesia
              </p>
              <p>
                <strong>Working Hours:</strong> Monday - Friday (08:00 - 18:00)
              </p>
              <p>
                <strong>Emergency Contact:</strong> +62 812 9876 5432 (24/7
                Support)
              </p>
              <p>
                <strong>WhatsApp:</strong> +62 811 2345 6789
              </p>
              <p>
                <strong>Telegram:</strong> @TravelySupport
              </p>
              <p>
                <strong>Fax:</strong> +62 21 7654 3210
              </p>
            </div>
            <div class="flex justify-center space-x-6 mt-6">
              <a
                href="#"
                class="text-orange-500 text-2xl hover:text-orange-700"
              >
                <i class="fab fa-facebook"></i>
              </a>
              <a
                href="#"
                class="text-orange-500 text-2xl hover:text-orange-700"
              >
                <i class="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                class="text-orange-500 text-2xl hover:text-orange-700"
              >
                <i class="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                class="text-orange-500 text-2xl hover:text-orange-700"
              >
                <i class="fab fa-whatsapp"></i>
              </a>
              <a
                href="#"
                class="text-orange-500 text-2xl hover:text-orange-700"
              >
                <i class="fab fa-telegram"></i>
              </a>
              <a
                href="#"
                class="text-orange-500 text-2xl hover:text-orange-700"
              >
                <i class="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactPage;
