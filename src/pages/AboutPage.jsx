import React from "react";
import {
  Award,
  Calendar,
  Clock,
  Flag,
  Gauge,
  Heart,
  MapPin,
  Shield,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button.jsx";
/**
 * Renders the About page with company story, stats, values, timeline, and team sections.
 */
const AboutPage = () => {
  const stats = [
    {
      icon: Users,
      label: "Happy Customers",
      value: "5,000+",
      color: "bg-gray-600",
    },
    {
      icon: Award,
      label: "Years of Experience",
      value: "5+",
      color: "bg-gray-700",
    },
    {
      icon: Clock,
      label: "Hours of Fun Daily",
      value: "12+",
      color: "bg-gray-600",
    },
    {
      icon: MapPin,
      label: "Track Length",
      value: "1/4 Mile",
      color: "bg-gray-700",
    },
  ];
  const values = [
    {
      icon: Heart,
      title: "Community First",
      description:
        "We're proud to be part of the Baytown community and committed to providing a space where families and friends can create lasting memories together.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "From our track design to our customer service, we strive for excellence in everything we do to ensure the best possible experience for every guest.",
    },
    {
      icon: Shield,
      title: "Safety & Fun",
      description:
        "Safety is our top priority, but we never forget that the ultimate goal is to have an amazing, thrilling, and unforgettable racing experience.",
    },
  ];
  const timeline = [
    {
      year: "2019",
      icon: Flag,
      title: "The Beginning",
      description:
        "Speedway 146 opened its doors with a vision to bring world-class go-kart racing to Baytown.",
    },
    {
      year: "2020",
      icon: Gauge,
      title: "Track Expansion",
      description:
        "We expanded our track and upgraded our fleet with state-of-the-art racing karts.",
    },
    {
      year: "2022",
      icon: Star,
      title: "Award Winner",
      description:
        "Named Baytown's Best Family Entertainment Venue by local community awards.",
    },
    {
      year: "2024",
      icon: Users,
      title: "Growing Strong",
      description:
        "Celebrating over 5,000 happy customers and countless unforgettable racing moments.",
    },
  ];
  const features = [
    {
      icon: Zap,
      title: "High-Speed Thrills",
      text: "Professional-grade karts reaching speeds that deliver pure adrenaline",
    },
    {
      icon: Shield,
      title: "Safety First",
      text: "State-of-the-art safety equipment and trained staff ensure peace of mind",
    },
    {
      icon: Users,
      title: "For Everyone",
      text: "Activities and experiences designed for all ages and skill levels",
    },
    {
      icon: Calendar,
      title: "Flexible Options",
      text: "Open Thursday through Sunday with special event bookings available",
    },
  ];
  return (
    <div className="w-full -mt-20">
      <section className="relative bg-navy-900 overflow-hidden pt-32 pb-20 min-h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url(/images/16.JPEG)" }}
          />
        </div>
        <div
          className="absolute inset-0 z-5 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(45deg, var(--color-black) 25%, transparent 25%), linear-gradient(-45deg, var(--color-black) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--color-black) 75%), linear-gradient(-45deg, transparent 75%, var(--color-black) 75%)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <div className="inline-block mb-6 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold tracking-wider">
              ABOUT US
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Where <span className="text-red-500">Speed Meets</span> Family Fun
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Baytown's premier destination for high-speed go-kart racing,
              bounce houses, and unforgettable family entertainment since 2019
            </p>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-white"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0% 100%)" }}
        />
      </section>
      <section className="py-20 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-110 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div
                  className={`${stat.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl`}
                >
                  <stat.icon className="h-10 w-10 text-white" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm lg:text-base font-semibold tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div data-aos="fade-right">
              <div className="inline-block mb-4 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold tracking-wider">
                OUR STORY
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                Built on <span className="text-red-600">Passion</span> for
                Racing
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Speedway 146 was born from a passion for racing and a vision to
                bring world-class go-kart racing to the Baytown community. We've
                created a state-of-the-art facility that combines the thrill of
                high-speed racing with a safe, family-friendly environment.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our professionally designed track, top-quality karts, and
                commitment to safety make us the go-to destination for racing
                enthusiasts, families, and anyone looking for an unforgettable
                experience.
              </p>
              <Link to="/contact">
                <Button size="lg" variant="primary">
                  Visit Us Today
                </Button>
              </Link>
            </div>
            <div data-aos="fade-left" className="relative">
              <div className="image-hover rounded-2xl overflow-hidden shadow-2xl h-[500px]">
                <img
                  src="/images/19.JPEG"
                  alt="Go-kart racing at Speedway 146"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gray-700 text-white p-6 rounded-xl shadow-xl max-w-xs">
                <div className="text-3xl font-bold mb-1">5+ Years</div>
                <div className="text-gray-300">of thrilling experiences</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="max-w-3xl mx-auto text-center mb-16"
            data-aos="fade-up"
          >
            <div className="inline-block mb-4 px-3 py-1 bg-gray-700 text-white rounded-full text-xs font-bold tracking-wider">
              WHY CHOOSE US
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              The Ultimate Racing Experience
            </h2>
            <p className="text-xl text-gray-600">
              We deliver unmatched excitement with top-notch facilities and a
              commitment to excellence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover-lift text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="bg-gradient-to-br from-gray-600 to-gray-700 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 bg-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/15.JPEG)" }}
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="max-w-3xl mx-auto text-center mb-16"
            data-aos="fade-up"
          >
            <div className="inline-block mb-4 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold tracking-wider">
              OUR VALUES
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              What Drives Us Forward
            </h2>
            <p className="text-xl text-gray-300">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gray-700 bg-opacity-50 backdrop-blur-md p-8 rounded-2xl hover-lift border border-gray-500 border-opacity-30"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="bg-gray-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {value.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="max-w-3xl mx-auto text-center mb-16"
            data-aos="fade-up"
          >
            <div className="inline-block mb-4 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold tracking-wider">
              OUR JOURNEY
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Racing Through The Years
            </h2>
            <p className="text-xl text-gray-600">
              From our humble beginnings to becoming Baytown's favorite racing
              destination
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className="relative bg-gray-50 p-8 rounded-2xl hover-lift"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="bg-gray-600 text-white w-14 h-14 rounded-xl flex items-center justify-center shadow-lg">
                        <item.icon className="h-7 w-7" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="text-red-600 font-bold text-lg mb-2">
                        {item.year}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div data-aos="fade-right" className="relative lg:order-1 order-2">
              <div className="image-hover rounded-2xl overflow-hidden shadow-2xl h-[500px]">
                <img
                  src="/images/16.JPEG"
                  alt="Speedway 146 team"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -right-6 bg-gray-700 text-white p-6 rounded-xl shadow-xl">
                <Target className="h-8 w-8 mb-2" />
                <div className="text-sm">Expert Team</div>
              </div>
            </div>
            <div data-aos="fade-left" className="lg:order-2 order-1">
              <div className="inline-block mb-4 px-3 py-1 bg-gray-700 text-white rounded-full text-xs font-bold tracking-wider">
                OUR TEAM
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                Passionate About{" "}
                <span className="text-red-600">Your Experience</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our experienced team is passionate about racing and dedicated to
                ensuring every visitor has an incredible experience. From our
                track marshals to our customer service staff, everyone at
                Speedway 146 is committed to safety, fun, and excellence.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Whether you're a first-time racer or a seasoned pro, our team is
                here to help you make the most of your visit and ensure you
                leave with a smile and memories that last a lifetime.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-gray-100 px-6 py-3 rounded-full">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-800 font-bold">
                    Safety Certified
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-gray-100 px-6 py-3 rounded-full">
                  <Award className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-800 font-bold">Expert Staff</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="py-20 text-white"
        style={{
          background:
            "linear-gradient(135deg, #334155 0%, #1e293b 50%, #0f172a 100%)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Experience The Thrill?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of happy racers and create unforgettable memories
              at Speedway 146
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-red-600 hover:bg-gray-100 border-0"
                >
                  View Pricing
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-800"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default AboutPage;
