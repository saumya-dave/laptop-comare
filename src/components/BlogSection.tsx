import React from 'react';

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const blogPosts = [
  {
    title: 'MacBook Air M3 vs Dell XPS 13: The Ultimate Ultrabook Showdown',
    excerpt: 'We pit Apple\'s latest against Dell\'s flagship to see which ultrabook reigns supreme in 2024.',
    category: 'Comparisons',
    readTime: '8 min read',
    image: 'https://picsum.photos/seed/blog1/400/250',
    featured: true
  },
  {
    title: 'Best Gaming Laptops Under $1500 in 2024',
    excerpt: 'Discover powerful gaming machines that won\'t break the bank, featuring RTX 4060 and Ryzen 7000 series.',
    category: 'Buying Guide',
    readTime: '12 min read',
    image: 'https://picsum.photos/seed/blog2/400/250',
    featured: false
  },
  {
    title: 'How to Choose the Right RAM for Your Laptop',
    excerpt: 'Understanding memory specifications, speeds, and how much RAM you actually need for different use cases.',
    category: 'Tech Guide',
    readTime: '6 min read',
    image: 'https://picsum.photos/seed/blog3/400/250',
    featured: false
  },
  {
    title: 'AMD vs Intel: Which CPU is Better for Laptops in 2024?',
    excerpt: 'A comprehensive comparison of the latest processors from AMD and Intel for laptop buyers.',
    category: 'Tech Explained',
    readTime: '10 min read',
    image: 'https://picsum.photos/seed/blog4/400/250',
    featured: false
  }
];

export const BlogSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Latest Guides & Reviews
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Stay informed with our expert insights, buying guides, and in-depth reviews
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Featured Article */}
          <div className="lg:col-span-2">
            <article className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl overflow-hidden text-white relative">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative p-8 lg:p-12 flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 mb-6 lg:mb-0 lg:pr-8">
                  <div className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    Featured
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                    {blogPosts[0].title}
                  </h3>
                  <p className="text-blue-100 mb-6 text-lg">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-blue-200 mb-6">
                    <span className="bg-blue-600/50 px-3 py-1 rounded-full">{blogPosts[0].category}</span>
                    <div className="flex items-center space-x-1">
                      <ClockIcon />
                      <span>{blogPosts[0].readTime}</span>
                    </div>
                  </div>
                  <button className="bg-white text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2">
                    <span>Read Article</span>
                    <ArrowRightIcon />
                  </button>
                </div>
                <div className="lg:w-1/2">
                  <img 
                    src={blogPosts[0].image} 
                    alt={blogPosts[0].title}
                    className="rounded-xl shadow-2xl w-full"
                  />
                </div>
              </div>
            </article>
          </div>

          {/* Regular Articles */}
          {blogPosts.slice(1).map((post, index) => (
            <article 
              key={index}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-slate-500">
                    <ClockIcon />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                    <span className="text-sm">Read More</span>
                    <ArrowRightIcon />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/25">
            View All Articles
          </button>
        </div>
      </div>
    </section>
  );
};