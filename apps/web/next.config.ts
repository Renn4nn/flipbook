import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	cacheComponents: true,
	experimental: {
		serverActions: {
			bodySizeLimit: '500mb'
		}
	}
}

export default nextConfig
