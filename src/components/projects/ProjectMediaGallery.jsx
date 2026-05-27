import React, { useState } from 'react';

const ProjectMediaGallery = ({ media }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images = media.filter(m => m.mediaType === 'image');
  const videos = media.filter(m => m.mediaType === 'video');
  const documents = media.filter(m => m.mediaType === 'document');

  const openLightbox = (item) => {
    setSelectedMedia(item);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedMedia(null);
  };

  return (
    <div className="space-y-6">
      {/* Images Grid */}
      {images.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((item, index) => (
              <div
                key={item.mediaId || index}
                onClick={() => openLightbox(item)}
                className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square"
              >
                <img
                  src={item.mediaUrl}
                  alt={item.title || 'Project image'}
                  className="w-full h-full object-cover transition transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
                  <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Videos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((item, index) => (
              <div key={item.mediaId || index} className="aspect-video">
                <video
                  src={item.mediaUrl}
                  controls
                  className="w-full h-full rounded-lg"
                  poster={item.thumbnailUrl}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      {documents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((item, index) => (
              <a
                key={item.mediaId || index}
                href={item.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <span className="text-3xl">📄</span>
                <div className="flex-1">
                  <p className="font-medium">{item.title || item.fileName}</p>
                  <p className="text-sm text-gray-500">
                    {item.fileSize ? `${(item.fileSize / 1024).toFixed(2)} KB` : 'Document'}
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
          >
            ×
          </button>
          
          <div className="max-w-5xl max-h-[90vh] p-4" onClick={e => e.stopPropagation()}>
            {selectedMedia.mediaType === 'image' ? (
              <img
                src={selectedMedia.mediaUrl}
                alt={selectedMedia.title}
                className="max-w-full max-h-[90vh] object-contain"
              />
            ) : selectedMedia.mediaType === 'video' ? (
              <video
                src={selectedMedia.mediaUrl}
                controls
                className="max-w-full max-h-[90vh]"
              />
            ) : (
              <iframe
                src={selectedMedia.mediaUrl}
                className="w-full h-[90vh]"
                title={selectedMedia.title}
              />
            )}
            
            {selectedMedia.description && (
              <p className="text-white text-center mt-4">{selectedMedia.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectMediaGallery;