import React from 'react';
import { Play, ExternalLink } from 'lucide-react';

const VideoSection: React.FC = () => {
  const handleVideoClick = () => {
    window.open('https://youtu.be/0aOBps6JCbs?si=8BDnNHX6edZUwj34', '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-red-900 via-red-800 to-navy-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Watch the Action at Speedway 146
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            See the excitement and thrills that await you at our track!
          </p>
          
          <div className="relative bg-black/30 rounded-xl overflow-hidden shadow-2xl cursor-pointer group" onClick={handleVideoClick}>
            <div className="aspect-video bg-gradient-to-br from-red-600/50 to-navy-900/50 flex items-center justify-center">
              <button className="bg-red-600/80 hover:bg-red-500 backdrop-blur-sm rounded-full p-6 transition-all duration-300 hover:scale-110 group-hover:shadow-lg group-hover:shadow-red-500/50">
                <Play className="h-12 w-12 text-white ml-1" />
              </button>
            </div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
              <ExternalLink className="h-3 w-3" />
              <span>Watch on YouTube</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;