/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "res.cloudinary.com",  }, {hostname : "img.icons8.com"}],
  },
  
};

export default nextConfig;
