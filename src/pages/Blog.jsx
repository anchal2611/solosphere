import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Clock, Calendar, ArrowRight, X, Heart, MessageSquare } from 'lucide-react';

export default function Blog() {
  const { blogPosts } = useContext(AppContext);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});

  const featuredPost = blogPosts.find(post => post.featured) || blogPosts[0];
  const gridPosts = blogPosts.filter(post => post.id !== featuredPost.id);

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const toggleLike = (postId, e) => {
    e.stopPropagation();
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="space-y-10 animate-slide-up relative">
      
      {/* Editorial Header */}
      <header className="border-b border-brand-text-muted/10 pb-6 space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-brand-text-dark">Solo Journal</h1>
        <p className="font-sans text-brand-text-muted text-sm">
          A collection of essays, reflections, and practical guides on the art of slow living and thriving alone.
        </p>
      </header>

      {/* FEATURED POST */}
      <div 
        onClick={() => handlePostClick(featuredPost)}
        className="bg-white rounded-brand-lg overflow-hidden border border-brand-bg-beige shadow-sm hover:shadow-md transition-shadow duration-500 cursor-pointer grid grid-cols-1 lg:grid-cols-2 group"
      >
        <div className="h-64 sm:h-80 lg:h-full relative overflow-hidden">
          <img 
            src={featuredPost.image} 
            alt={featuredPost.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 bg-brand-terracotta text-brand-bg-warm font-sans text-xxs font-semibold px-3 py-1 rounded-full shadow-sm">
            Featured Article
          </div>
        </div>

        <div className="p-8 md:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex gap-3 text-xxs font-sans text-brand-text-muted items-center">
              <span className="font-semibold uppercase tracking-widest text-brand-terracotta">{featuredPost.tag}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {featuredPost.date}
              </span>
            </div>

            <h2 className="font-serif text-2xl md:text-3.5xl font-bold text-brand-text-dark leading-tight group-hover:text-brand-terracotta transition-colors">
              {featuredPost.title}
            </h2>
            
            <p className="font-sans text-xs text-brand-text-muted leading-relaxed line-clamp-4">
              {featuredPost.excerpt}
            </p>
          </div>

          <div className="pt-6 border-t border-brand-text-muted/10 flex items-center justify-between font-sans text-xs text-brand-text-muted">
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {featuredPost.readTime}
            </span>
            <span className="text-brand-terracotta font-semibold flex items-center gap-1 group/btn">
              Read Essay
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>

      {/* ARTICLE GRID */}
      <section className="space-y-6">
        <h3 className="font-serif text-xl font-bold text-brand-text-dark px-2">More from the Journal</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => handlePostClick(post)}
              className="bg-white rounded-brand border border-brand-bg-beige overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Post Image */}
                <div className="h-44 overflow-hidden relative">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 bg-brand-bg-warm/95 px-2 py-0.5 rounded-full text-xxs font-semibold text-brand-text-dark">
                    {post.tag}
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 space-y-2">
                  <span className="font-sans text-[10px] text-brand-text-muted">{post.date}</span>
                  <h4 className="font-serif font-bold text-lg text-brand-text-dark leading-snug group-hover:text-brand-terracotta transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-brand-text-muted font-sans line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-4 mt-4 border-t border-brand-text-muted/10 flex items-center justify-between font-sans text-xxs text-brand-text-muted">
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {post.readTime}
                </span>

                <button 
                  onClick={(e) => toggleLike(post.id, e)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all ${
                    likedPosts[post.id]
                      ? 'bg-brand-terracotta/5 border-brand-terracotta/20 text-brand-terracotta'
                      : 'border-brand-bg-beige hover:border-brand-text-muted/30 text-brand-text-muted'
                  }`}
                >
                  <Heart size={11} className={likedPosts[post.id] ? 'fill-brand-terracotta' : ''} />
                  <span>{likedPosts[post.id] ? 'Liked' : 'Like'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FULL READ ESSAY MODAL OVERLAY */}
      {selectedPost && (
        <div className="fixed inset-0 bg-brand-text-dark/40 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
          <div className="bg-brand-bg-warm max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-brand-lg shadow-2xl relative p-6 sm:p-10 animate-slide-up flex flex-col space-y-6">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-1.5 text-brand-text-muted hover:text-brand-text-dark hover:bg-brand-bg-beige rounded-full transition-colors z-10"
              title="Close article"
            >
              <X size={20} />
            </button>

            {/* Header details */}
            <div className="space-y-4 pt-4">
              <div className="flex gap-3 text-xxs font-sans text-brand-text-muted items-center">
                <span className="font-semibold uppercase tracking-widest text-brand-terracotta">{selectedPost.tag}</span>
                <span>•</span>
                <span>{selectedPost.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {selectedPost.readTime}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4.5xl font-bold text-brand-text-dark leading-tight">
                {selectedPost.title}
              </h2>
            </div>

            {/* Banner Image */}
            <div className="h-56 sm:h-72 rounded-brand overflow-hidden shrink-0 shadow-sm">
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content text */}
            <div className="font-sans text-xs text-brand-text-dark leading-relaxed space-y-4">
              {selectedPost.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              <p className="border-t border-brand-text-muted/10 pt-6 italic text-xxs text-brand-text-muted font-sans">
                Thank you for reading the Solo Journal. Thriving alone begins with intentional reflections.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
